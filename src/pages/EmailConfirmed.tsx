
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const EmailConfirmed = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col items-center">
        <CheckCircle className="text-green-600 w-12 h-12 mb-2" />
        <CardTitle>Email Verified!</CardTitle>
        <CardDescription className="text-center">
          Your email has been successfully verified.<br />You can now sign in to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Button asChild className="w-full">
          <Link to="/auth">Go to Login</Link>
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default EmailConfirmed;
