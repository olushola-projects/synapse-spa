
// First Button
<Button 
  type="button" 
  className="w-full bg-blue-700 hover:bg-blue-800 py-6 text-white"
  onClick={toggleForm}
>
  <span className="flex items-center justify-center">
    Get Early Access <ArrowRight className="ml-2" size={18} />
  </span>
</Button>

// Full Form Submit Button
<Button 
  type="submit" 
  className="w-full bg-blue-700 hover:bg-blue-800 py-6 text-white"
  disabled={isSubmitting}
>
  {isSubmitting ? (
    <span className="flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Processing...
    </span>
  ) : (
    <span className="flex items-center justify-center">
      Get Early Access <ArrowRight className="ml-2" size={18} />
    </span>
  )}
</Button>
