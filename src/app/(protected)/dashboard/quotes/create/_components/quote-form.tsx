"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Textarea } from "@/src/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { QuoteSchema, type QuoteFormValues } from "@/src/schema/quote";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Settings2,
  EyeOff,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { cn } from "@/src/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Switch } from "@/src/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
} from "@/src/components/ui/collapsible";
import { MediaSelectorModal } from "@/src/app/(protected)/dashboard/media/_components/MediaSelectorModal";
import { BusinessInfoSkeleton } from "./business-info-skeleton";

import { X } from "lucide-react";
import { QuotePreview } from "./quote-preview";
import Image from "next/image";
import { createQuote } from "../../quote.action";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { QuoteWithCustomer } from "@/src/types/quote";

type QuoteFormProps = {
  initialData?: QuoteWithCustomer;
};

export function QuoteForm({ initialData }: QuoteFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showBusinessLogoSelector, setShowBusinessLogoSelector] =
    useState(false);
  const [showCustomerLogoSelector, setShowCustomerLogoSelector] =
    useState(false);
  const [showAdditionalCustomerInfo, setShowAdditionalCustomerInfo] =
    useState(false);

  const [previewCustomerLogo, setPreviewCustomerLogo] = useState<string | null>(
    null
  );
  const [defaultBusinessLogo, setDefaultBusinessLogo] = useState<string | null>(
    null
  );
  const [customBusinessLogo, setCustomBusinessLogo] = useState<string | null>(
    null
  );
  const [isLoadingBusinessInfo, setIsLoadingBusinessInfo] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const QUOTE_FORM_STORAGE_KEY = "quote_form_data";

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(QuoteSchema),
    defaultValues: {
      items: [
        {
          name: "",
          description: "",
          quantity: 1,
          unitPrice: 0,
          productId: "",
          total: 0,
        },
      ],
      quoteDate: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      currency: "USD",
      discountType: "percentage",
      discountValue: 0,
      taxType: "percentage",
      taxValue: 0,
      status: "DRAFT",
      businessEmail: "",
      businessName: "",
      businessAddress: "",
      businessPhone: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Save to local storage whenever form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value && Object.keys(value).length > 0) {
        localStorage.setItem(QUOTE_FORM_STORAGE_KEY, JSON.stringify(value));
        setLastSaved(new Date());
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Load data from local storage on initial render
  useEffect(() => {
    const storedData = localStorage.getItem(QUOTE_FORM_STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // Convert date strings back to Date objects
        if (parsedData.quoteDate) {
          parsedData.quoteDate = new Date(parsedData.quoteDate);
        }
        if (parsedData.validUntil) {
          parsedData.validUntil = new Date(parsedData.validUntil);
        }
        form.reset(parsedData);
      } catch (error) {
        console.error("Failed to parse local storage data:", error);
      }
    }
  }, [form]);

  // Fetch store data on mount
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch("/api/store");
        const data = await response.json();

        if (data.store) {
          setDefaultBusinessLogo(data.store.logo);
          if (!localStorage.getItem(QUOTE_FORM_STORAGE_KEY)) {
            form.reset({
              ...form.getValues(),
              businessName: data.store.name || "",
              businessLogo: data.store.logo || "",
              businessAddress: data.store.address || "",
              businessPhone: data.store.phoneNumber || "",
              businessEmail: data.store.email || "",
              businessWebsite: data.store.website || "",
              businessTaxNumber: data.store.taxNumber || "",
              currency: data.store.currency || "USD",
              termsAndConditions: data.store.termsAndConditions || "",
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch store data:", error);
        toast.error("Failed to load store data");
      } finally {
        setIsLoadingBusinessInfo(false);
      }
    };

    fetchStoreData();
  }, [form]);

  const onSubmit = async (values: QuoteFormValues) => {
    try {
      if (!session?.user?.id) {
        toast.error("You must be logged in to create a quote");
        return;
      }

      // Calculate totals for the quote
      const totals = calculateTotals();

      // Create quote using server action with all form data
      const quote = await createQuote({
        // Customer Information
        customerId: "", // This will be set by the server action after upserting the customer
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
        customerAddress: values.customerAddress,

        // Business Information
        businessName: values.businessName,
        businessLogo: customBusinessLogo || defaultBusinessLogo || undefined,
        businessAddress: values.businessAddress,
        businessPhone: values.businessPhone,
        businessEmail: values.businessEmail || "", // Ensure businessEmail is never undefined
        businessWebsite: values.businessWebsite,
        businessTaxNumber: values.businessTaxNumber,
        revisionNumber: 1, // Set default revision number for new quotes

        // Quote Items
        items: values.items.map((item) => ({
          productId: item.productId || "", // Add productId field
          quantity: item.quantity || 0,
          unitPrice: item.unitPrice || 0,
          description: item.description || "",
          discountType: "percentage",
          discountValue: 0,
          taxType: "percentage",
          taxValue: 0,
          total: (item.quantity || 0) * (item.unitPrice || 0),
        })),

        // Quote Details
        quoteDate: values.quoteDate,
        validUntil: values.validUntil,
        currency: values.currency,
        referenceNumber: values.referenceNumber,
        salespersonName: values.salespersonName,

        // Financial Details
        subtotal: totals.subtotal,
        discountType: values.discountType || "percentage",
        discountValue: values.discountValue || 0,
        taxType: values.taxType || "percentage",
        taxValue: values.taxValue || 0,
        total: totals.total,

        // Quote-specific fields
        status: values.status || "DRAFT",
        validityPeriod: 30, // Set default validity period to 30 days

        // Additional Information
        notes: values.notes,
        termsAndConditions: values.termsAndConditions,

        // Metadata
        createdById: session.user.id,
      });

      if (!quote) {
        throw new Error("Failed to create quote - no quote returned");
      }

      // Clear local storage after successful creation
      localStorage.removeItem(QUOTE_FORM_STORAGE_KEY);

      toast.success("Quote created successfully!");
      router.push("/dashboard/quotes");
    } catch (error) {
      console.error("Failed to create quote:", error);
      if (error instanceof Error) {
        toast.error(`Failed to create quote: ${error.message}`);
      } else {
        toast.error("Failed to create quote: Unknown error occurred");
      }
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const items = form.getValues("items");
    const subtotal = items.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
      0
    );

    const discountType = form.getValues("discountType");
    const discountValue = form.getValues("discountValue") || 0;
    const taxType = form.getValues("taxType");
    const taxValue = form.getValues("taxValue") || 0;

    // Calculate discount amount based on type
    const discountAmount =
      discountType === "percentage"
        ? (subtotal * discountValue) / 100
        : discountValue;

    // Calculate tax amount based on type
    const taxableAmount = subtotal - discountAmount;
    const taxAmount =
      taxType === "percentage" ? (taxableAmount * taxValue) / 100 : taxValue;

    const total = taxableAmount + taxAmount;

    return {
      subtotal: isNaN(subtotal) ? 0 : subtotal,
      discountAmount: isNaN(discountAmount) ? 0 : discountAmount,
      taxAmount: isNaN(taxAmount) ? 0 : taxAmount,
      total: isNaN(total) ? 0 : total,
    };
  };

  const handleBusinessLogoSelect = async (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomBusinessLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomerLogoSelect = async (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewCustomerLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoadingBusinessInfo && !initialData) {
    return <BusinessInfoSkeleton />;
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Business Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
              <CardTitle>Business Information</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowBusinessInfo(!showBusinessInfo)}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <Collapsible open={showBusinessInfo}>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    {customBusinessLogo ? (
                      <div className="relative">
                        <Image
                          src={customBusinessLogo}
                          alt="Business Logo"
                          height={80}
                          width={80}
                          className="h-20 w-auto"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute -right-2 -top-2"
                          onClick={() => {
                            setCustomBusinessLogo(null);
                            form.setValue(
                              "businessLogo",
                              defaultBusinessLogo || ""
                            );
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : defaultBusinessLogo ? (
                      <div className="flex items-center gap-3">
                        <Image
                          src={defaultBusinessLogo}
                          alt="Business Logo"
                          width={80}
                          height={80}
                          className="h-20 w-auto rounded-md"
                        />
                      </div>
                    ) : null}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowBusinessLogoSelector(true)}
                    >
                      {customBusinessLogo
                        ? "Change Custom Logo"
                        : defaultBusinessLogo
                        ? "Change Logo"
                        : "Upload Logo"}
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="businessTaxNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="businessAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="businessPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="businessEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreview(true)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Quote
            </Button>
            <Button type="submit">Create Quote</Button>
            {lastSaved && (
              <span className="text-sm text-muted-foreground ml-4">
                Last saved to browser: {format(lastSaved, "h:mm a")}
              </span>
            )}
          </div>
        </form>
      </Form>

      {/* Preview Modal */}
      {showPreview && (
        <QuotePreview
          open={showPreview}
          onOpenChange={setShowPreview}
          formValues={form.getValues()}
          businessLogo={customBusinessLogo || defaultBusinessLogo}
          customerLogo={previewCustomerLogo}
        />
      )}

      {/* Business Logo Selector */}
      <MediaSelectorModal
        open={showBusinessLogoSelector}
        onOpenChange={setShowBusinessLogoSelector}
        onMediaSelect={() => {}}
        onFileSelect={handleBusinessLogoSelect}
        allowedTypes={["upload"]}
        showLibrary={false}
        reset={false}
      />

      {/* Customer Logo Selector */}
      <MediaSelectorModal
        open={showCustomerLogoSelector}
        onOpenChange={setShowCustomerLogoSelector}
        onMediaSelect={() => {}}
        onFileSelect={handleCustomerLogoSelect}
        allowedTypes={["upload"]}
        showLibrary={false}
        reset={false}
      />
    </>
  );
}
