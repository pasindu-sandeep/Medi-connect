import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./../../../components/atoms/Botton";
import { Input } from "./../../../components/atoms/Input";
import { Label } from "./../../../components/atoms/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./../../../components/molecules/Card";
import { Alert, AlertDescription } from "./../../../components/atoms/Alert";
import { Loader2, Shield, User } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./../../../components/molecules/Tab";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simple validation - in a real app, this would be a server call
      if (email === "admin@example.com" && password === "admin123") {
        localStorage.setItem("user", JSON.stringify({ role: "admin", email }));
        navigate("/dashboard");
      } else if (
        email === "security@example.com" &&
        password === "security123"
      ) {
        localStorage.setItem(
          "user",
          JSON.stringify({ role: "security", email })
        );
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsAdmin = () => {
    setEmail("admin@example.com");
    setPassword("admin123");
    setSelectedRole("admin");
  };

  const loginAsSecurity = () => {
    setEmail("security@example.com");
    setPassword("security123");
    setSelectedRole("security");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">
          Student Authentication System
        </CardTitle>
        <CardDescription>Login to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="quicklogin">Quick Login</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="quicklogin">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                For development purposes only. Quick login as:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={selectedRole === "admin" ? "default" : "outline"}
                  className={`h-24 flex flex-col items-center justify-center gap-2 ${
                    selectedRole === "admin" ? "border-2 border-primary" : ""
                  }`}
                  onClick={loginAsAdmin}
                >
                  <User className="h-8 w-8" />
                  <span>Admin</span>
                </Button>
                <Button
                  variant={selectedRole === "security" ? "default" : "outline"}
                  className={`h-24 flex flex-col items-center justify-center gap-2 ${
                    selectedRole === "security" ? "border-2 border-primary" : ""
                  }`}
                  onClick={loginAsSecurity}
                >
                  <Shield className="h-8 w-8" />
                  <span>Security</span>
                </Button>
              </div>
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={isLoading || !selectedRole}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  `Login as ${
                    selectedRole
                      ? selectedRole.charAt(0).toUpperCase() +
                        selectedRole.slice(1)
                      : "Selected Role"
                  }`
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col text-sm text-muted-foreground">
        <p>Demo credentials:</p>
        <p>Admin: admin@example.com / admin123</p>
        <p>Security: security@example.com / security123</p>
      </CardFooter>
    </Card>
  );
}

export default LoginForm;
