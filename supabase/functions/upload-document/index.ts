import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('documentType') as string || 'other'

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate file type and size
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ error: 'File too large. Maximum size is 10MB.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2)
    const fileExtension = file.name.split('.').pop()
    const storagePath = `${user.id}/${timestamp}_${randomId}.${fileExtension}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload file' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Save document metadata to database
    const { data: docData, error: dbError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        filename: file.name,
        file_size: file.size,
        file_type: file.type,
        storage_path: storagePath,
        document_type: documentType,
        processing_status: 'pending'
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Clean up uploaded file
      await supabase.storage.from('documents').remove([storagePath])
      
      return new Response(
        JSON.stringify({ error: 'Failed to save document metadata' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Trigger document analysis (simulate with timeout for demo)
    setTimeout(async () => {
      try {
        const analysisResults = {
          summary: 'Document uploaded successfully and ready for SFDR compliance analysis',
          detectedContent: {
            hasPAIData: file.name.toLowerCase().includes('pai'),
            hasTaxonomyInfo: file.name.toLowerCase().includes('taxonomy'),
            hasDisclosureData: file.name.toLowerCase().includes('disclosure')
          },
          extractedData: {
            fundName: 'To be extracted',
            articleClassification: 'To be determined',
            sustainabilityMetrics: []
          },
          compliance: {
            sfdrReadiness: 'pending_review',
            missingElements: ['PAI indicators validation', 'Taxonomy alignment check']
          }
        }

        await supabase
          .from('documents')
          .update({
            processing_status: 'completed',
            analysis_results: analysisResults
          })
          .eq('id', docData.id)

        console.log(`Document analysis completed for ${docData.id}`)
      } catch (error) {
        console.error('Analysis error:', error)
        await supabase
          .from('documents')
          .update({
            processing_status: 'failed'
          })
          .eq('id', docData.id)
      }
    }, 3000) // 3 second delay to simulate processing

    return new Response(
      JSON.stringify({
        success: true,
        document: docData,
        message: 'Document uploaded successfully. Analysis in progress...'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})