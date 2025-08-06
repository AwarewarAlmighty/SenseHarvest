import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook
import MainHeader from "./MainHeader";

const Profile = () => {
  const { user } = useAuth(); // Get the logged-in user from the context

  // If the user data is not yet available, show a loading state or return null
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <main className="container mx-auto py-10">
          <p>Loading profile...</p>
        </main>
      </div>
    );
  }

  // Use the first two letters of the email for the avatar fallback
  const fallback = user.email ? user.email.substring(0, 2).toUpperCase() : "U";

  return (
    <div className="min-h-screen bg-background">
        <MainHeader />
        <main className="container mx-auto py-10">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                    {/* The avatar image is dynamically generated based on the user's email */}
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt={user.email} />
                    <AvatarFallback>{fallback}</AvatarFallback>
                    </Avatar>
                    <div>
                    <Label htmlFor="picture">Profile Picture</Label>
                    <Input id="picture" type="file" className="mt-1"/>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    {/* The username can be fetched from the user object if available, otherwise it's an empty input */}
                    <Input id="name" defaultValue={user.username || ''} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {/* The email is read-only as it's the primary identifier */}
                    <Input id="email" type="email" defaultValue={user.email} readOnly />
                </div>
                <Button>Save Changes</Button>
                </CardContent>
            </Card>
        </main>
    </div>
  );
};

export default Profile;