"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { JSX } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/src/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addUser } from "../user-action";
import { userRoles } from "./user-ui/data/data";
import { User2, Shield, Crown, PenTool, Ban, User } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  role: z.enum([
    UserRole.SUPERADMIN,
    UserRole.ADMIN,
    UserRole.DENTIST,
    UserRole.STAFF,
    UserRole.PATIENT,
  ]),
});

const getIcon = (iconName: string) => {
  const icons: { [key: string]: JSX.Element } = {
    user: <User2 className="h-4 w-4 text-muted-foreground" />,
    shield: <Shield className="h-4 w-4 text-muted-foreground" />,
    crown: <Crown className="h-4 w-4 text-muted-foreground" />,
    pen: <PenTool className="h-4 w-4 text-muted-foreground" />,
    staff: <User className="h-4 w-4 text-muted-foreground" />,
    ban: <Ban className="h-4 w-4 text-muted-foreground" />,
  };
  return icons[iconName] || null;
};

export default function AddUserForm() {
  const [submitting, setSubmitting] = React.useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: UserRole.PATIENT,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      await addUser(values);
      form.reset();
      toast.success("User added successfully!");
      router.refresh();
      router.push("/dashboard/users");
    } catch (error: any) {
      toast.error(error.message || "Failed to add user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Add New User</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter user's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter user's email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userRoles
                        .filter((role) => role.value !== UserRole.BANNED)
                        .map((role) => (
                          <SelectItem
                            key={role.value}
                            value={role.value}
                            className="flex items-center gap-2"
                          >
                            <div className="flex items-center gap-2">
                              {role.iconName && getIcon(role.iconName)}
                              <p>{role.label}</p>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add User"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
