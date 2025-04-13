
import React from "react";
import { motion } from "framer-motion";
import { PartnerCategory } from "@/types/partners";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface PartnerCategoryCardProps {
  category: PartnerCategory;
  index: number;
}

const PartnerCategoryCard: React.FC<PartnerCategoryCardProps> = ({ category, index }) => {
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center gap-3 mb-3">
            <div className={`rounded-md p-2 bg-gradient-to-br ${category.color} text-white`}>
              <category.icon className="h-5 w-5" />
            </div>
            <CardTitle>{category.title}</CardTitle>
          </div>
          <CardDescription className="text-base">{category.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <h4 className="font-medium mb-3 text-sm">Key Benefits:</h4>
          <ul className="space-y-2 mb-5">
            {category.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <div className="rounded-full bg-green-100 p-1 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path
                      d="M3.5 6.5L2 5l-.5.5L3.5 7.5 8 3l-.5-.5z"
                      fill="currentColor"
                      className="text-green-600"
                    />
                  </svg>
                </div>
                <span className="text-sm">{benefit}</span>
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300">
            Learn More <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PartnerCategoryCard;
