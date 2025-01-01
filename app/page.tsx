"use client";

import React, { useState } from "react";
import { Calculator, AlertCircle } from "lucide-react";

// UI Components
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className="text-gray-800" {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className="flex flex-col space-y-2 p-2" {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className="text-2xl font-semibold tracking-tight" {...props} />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className="text-sm text-gray-500" {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className="p-3 pt-0" {...props} />
));
CardContent.displayName = "CardContent";

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "destructive" }
>(({ variant = "default", className, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground ${
      variant === "destructive"
        ? "border-red-500/50 text-red-600"
        : "bg-gray-100 text-gray-800"
    }`}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className="text-sm [&_p]:leading-relaxed" {...props} />
));
AlertDescription.displayName = "AlertDescription";

// Utility Functions
const calculateServiceDuration = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const years = Math.floor(totalDays / 365);
  const remainingDays = totalDays % 365;
  const months = Math.floor(remainingDays / 30);
  const days = remainingDays % 30;

  // Convert years and months to decimal format
  const decimalYears = years + months / 12 + days / 365;

  return { years, months, days, totalDays, decimalYears };
};

const calculateGratuityAmount = (
  basicSalary: number,
  serviceYears: number,
  rule: string,
  unPaidLeaveDays: string,
  decimalYears: number
) => {
  if (serviceYears < 1) {
    return {
      amount: 0,
      error: "Minimum 1 year of service required for gratuity.",
    };
  }

  let gratuityAmount = 0;
  const dailySalary = (basicSalary * 12) / 365;

  // Current Rule Calculation (21 days for the first year, 30 days for subsequent years)
  if (rule === "currentRule") {
    if (serviceYears <= 1) {
      gratuityAmount = dailySalary * 21 * decimalYears;
    } else {
      gratuityAmount =
        dailySalary * 21 * 1 + dailySalary * 30 * (serviceYears - 1);
    }
  }

  // Old Rule Calculation (25 days for the first 3 years, 30 days for next 3 years, 35 days for remaining years)
  else if (rule === "oldRule") {
    if (serviceYears <= 3) {
      gratuityAmount = dailySalary * 25 * serviceYears;
    } else if (serviceYears <= 6) {
      gratuityAmount =
        dailySalary * 25 * 3 + dailySalary * 30 * (serviceYears - 3);
    } else {
      gratuityAmount =
        dailySalary * 25 * 3 +
        dailySalary * 30 * 3 +
        dailySalary * 35 * (serviceYears - 6);
    }
  }

  // Apply reduction for resignation if applicable
  if (unPaidLeaveDays && Number(unPaidLeaveDays) > 0) {
    gratuityAmount -= Number(unPaidLeaveDays) * dailySalary;
  }

  return { amount: gratuityAmount, error: null, dailySalary, decimalYears };
};

// Main Component
interface FormData {
  basicSalary: string;
  startDate: string;
  endDate: string;
  rule: string;
  unPaidLeaveDays: string;
}

interface Result extends FormData {
  gratuityAmount: string;
  dailySalary: any;
  decimalYears: any;
  duration: {
    years: number;
    months: number;
    days: number;
    totalDays: number;
  };
}

const GratuityCalculator = () => {
  const [formData, setFormData] = useState<FormData>({
    basicSalary: "",
    startDate: "",
    endDate: "",
    unPaidLeaveDays: "0",
    rule: "currentRule",
  });

  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.basicSalary || !formData.startDate || !formData.endDate) {
      setError("Please fill in all required fields");
      return false;
    }
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError("End date must be after start date");
      return false;
    }
    return true;
  };

  const calculateGratuity = () => {
    if (!validateForm()) return;

    const duration : any= calculateServiceDuration(
      formData.startDate,
      formData.endDate
    );

    const {
      amount,
      error: calculationError,
      dailySalary,
    } = calculateGratuityAmount(
      Number(formData.basicSalary),
      duration.years + duration.months / 12,
      formData.rule,
      formData.unPaidLeaveDays,
      duration.decimalYears
    );

    if (calculationError) {
      setError(calculationError);
      setResult(null);
      return;
    }

    setResult({
      gratuityAmount: amount.toFixed(2),
      dailySalary : dailySalary?.toFixed(2),
      duration: {
        years: duration.years,
        months: duration.months,
        days: duration.days,
        totalDays: duration.totalDays,
        decimalYears: duration.decimalYears,
      },
      ...formData,
    });

    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 md:py-8 md:px-3">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <div className="py-5 flex flex-col gap-2 items-center justify-center">
            <h1 className="flex flex-row justify-center items-center gap-2 text-blue-600">
              <Calculator className="h-6 w-6" />
              <span className="text-2xl">UAE Gratuity Calculator</span>
            </h1>
            <span className="text-gray-600 px-3 text-center">
              Calculate your end of service benefits according to UAE Labor Law
            </span>
          </div>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Input Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Basic Monthly Salary (AED)
                  </label>
                  <input
                    type="number"
                    name="basicSalary"
                    value={formData.basicSalary}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter basic salary"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Start Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Leave without Pay (Days)
                  </label>
                  <input
                    type="number"
                    name="unPaidLeaveDays"
                    value={formData.unPaidLeaveDays}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter leave without pay days"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Rule for Gratuity
                  </label>
                  <select
                    name="rule"
                    value={formData.rule}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="currentRule">
                      Current Rule (21 days for the first year, 30 days for the
                      rest)
                    </option>
                    <option value="oldRule">
                      Old Rule (25 days for first 3 years, 30 days for next 3
                      years, 35 days for others)
                    </option>
                  </select>
                </div>

                <div>
                  <button
                    onClick={calculateGratuity}
                    className="w-full py-3 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Calculate Gratuity
                  </button>
                </div>
              </div>

              {/* Result Section */}
              <div className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {result && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Gratuity Calculation Result</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {/* <div className="flex justify-between text-sm px-2">
                          <span>Years of Service:</span>
                          <span>{result.duration.years} years</span>
                        </div>
                        <div className="flex justify-between text-sm px-2">
                          <span>Months of Service:</span>
                          <span>{result.duration.months} months</span>
                        </div>
                        <div className="flex justify-between text-sm px-2">
                          <span>Days of Service:</span>
                          <span>{result.duration.days} days</span>
                        </div> */}
                        <div className="flex justify-between text-sm font-medium px-2">
                          <span>Total Service (in days):</span>
                          <span>{result.duration.totalDays} days</span>
                        </div>
                        <div className="flex justify-between text-sm px-2">
                          <span>Daily Salary:</span>
                          <span>AED {result.dailySalary}</span>
                        </div>
                        <div className="flex justify-between text-sm px-2">
                          <span>Decimal Years:</span>
                          <span>
                            {result.duration.decimalYears.toFixed(2)} years
                          </span>
                        </div>
                        <div className="flex justify-between text-sm bg-gray-300 py-2 px-2">
                          <span>Calculated Gratuity:</span>
                          <span>AED {result.gratuityAmount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GratuityCalculator;
