import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Users, LineChart, Loader2 } from "lucide-react";
import logoImage from "@/assets/logo.png";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.enum(["investor", "expert"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultTab = searchParams.get("mode") === "signup" ? "signup" : "signin";

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "", role: "investor" },
  });

  useEffect(() => {
    if (user && !authLoading) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const handleSignIn = async (data: SignInFormData) => {
    setIsSubmitting(true);
    const { error } = await signIn(data.email, data.password);
    setIsSubmitting(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message === "Invalid login credentials" 
          ? "Invalid email or password. Please try again."
          : error.message,
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      navigate("/");
    }
  };

  const handleSignUp = async (data: SignUpFormData) => {
    setIsSubmitting(true);
    const { error } = await signUp(data.email, data.password, data.fullName, data.role);
    setIsSubmitting(false);

    if (error) {
      let errorMessage = error.message;
      if (error.message.includes("already registered")) {
        errorMessage = "This email is already registered. Please sign in instead.";
      }
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: errorMessage,
      });
    } else {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account before signing in.",
      });
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container flex min-h-[80vh] items-center justify-center py-12">
        <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-2">
          {/* Left side - Branding */}
          <div className="hidden flex-col justify-center space-y-6 lg:flex">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="NeuraBridge" className="h-12 w-auto" />
              <span className="font-display text-3xl font-bold text-foreground">
                NeuraBridge
              </span>
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground">
              Connect with Market Experts
            </h1>
            <p className="text-lg text-muted-foreground">
              Join the platform where retail investors discover trusted market experts 
              across stocks, crypto, forex, and more.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">For Investors</h3>
                  <p className="text-sm text-muted-foreground">
                    Discover experts and access exclusive market insights
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                  <LineChart className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">For Experts</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your expertise and build a subscriber base
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Auth forms */}
          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center lg:hidden mb-4">
                <img src={logoImage} alt="NeuraBridge" className="h-10 w-auto" />
              </div>
              <CardTitle className="font-display text-2xl">
                Welcome to NeuraBridge
              </CardTitle>
              <CardDescription>
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Sign In Tab */}
                <TabsContent value="signin" className="space-y-4 pt-4">
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        {...signInForm.register("email")}
                      />
                      {signInForm.formState.errors.email && (
                        <p className="text-sm text-destructive">
                          {signInForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        {...signInForm.register("password")}
                      />
                      {signInForm.formState.errors.password && (
                        <p className="text-sm text-destructive">
                          {signInForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Sign Up Tab */}
                <TabsContent value="signup" className="space-y-4 pt-4">
                  <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        {...signUpForm.register("fullName")}
                      />
                      {signUpForm.formState.errors.fullName && (
                        <p className="text-sm text-destructive">
                          {signUpForm.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        {...signUpForm.register("email")}
                      />
                      {signUpForm.formState.errors.email && (
                        <p className="text-sm text-destructive">
                          {signUpForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        {...signUpForm.register("password")}
                      />
                      {signUpForm.formState.errors.password && (
                        <p className="text-sm text-destructive">
                          {signUpForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Confirm Password</Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="••••••••"
                        {...signUpForm.register("confirmPassword")}
                      />
                      {signUpForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-destructive">
                          {signUpForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-3">
                      <Label>I am a...</Label>
                      <RadioGroup
                        defaultValue="investor"
                        onValueChange={(value) => signUpForm.setValue("role", value as "investor" | "expert")}
                        className="grid grid-cols-2 gap-4"
                      >
                        <Label
                          htmlFor="role-investor"
                          className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                        >
                          <RadioGroupItem value="investor" id="role-investor" className="sr-only" />
                          <Users className="mb-3 h-6 w-6" />
                          <span className="font-medium">Investor</span>
                          <span className="text-xs text-muted-foreground text-center mt-1">
                            Discover & subscribe
                          </span>
                        </Label>
                        <Label
                          htmlFor="role-expert"
                          className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                        >
                          <RadioGroupItem value="expert" id="role-expert" className="sr-only" />
                          <TrendingUp className="mb-3 h-6 w-6" />
                          <span className="font-medium">Expert</span>
                          <span className="text-xs text-muted-foreground text-center mt-1">
                            Share insights
                          </span>
                        </Label>
                      </RadioGroup>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AuthPage;
