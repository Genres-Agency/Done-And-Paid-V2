"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem, // Add this import
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
import { Plus, Trash2, Settings2, EyeOff, Eye, X } from "lucide-react";
import { format } from "date-fns";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
} from "@/src/components/ui/collapsible";
import { MediaSelectorModal } from "@/src/app/(protected)/dashboard/media/_components/MediaSelectorModal";
import { BusinessInfoSkeleton } from "./business-info-skeleton";
import { QuotePreview } from "./quote-preview";
import Image from "next/image";
import { createQuote } from "../../quote.action";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function QuoteForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);
  const [showQuoteStatus, setShowQuoteStatus] = useState(false);
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
          discountType: "percentage",
          discountValue: 0,
          taxType: "percentage",
          taxValue: 0,
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
      validityPeriod: 30,
      referenceNumber: "",
      salespersonName: "",
      notes: "",
      termsAndConditions: "",
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
        revisionNumber: 1, // Initial revision number for new quotes
        customerName: values.customerName,

        // Business Information
        businessName: values.businessName,
        businessLogo: customBusinessLogo || defaultBusinessLogo || undefined,
        businessAddress: values.businessAddress,
        businessPhone: values.businessPhone,
        businessEmail: values.businessEmail,
        // Quote Items
        items: values.items.map((item) => ({
          productId: item.productId || "",
          quantity: item.quantity || 0,
          unitPrice: item.unitPrice || 0,
          description: item.description || "",
          discountType: values.discountType,
          discountValue: values.discountValue,
          taxType: values.taxType,
          taxValue: values.taxValue,
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
        discountType: values.discountType,
        discountValue: values.discountValue,
        taxType: values.taxType,
        taxValue: values.taxValue,
        total: totals.total,

        // Quote-specific fields
        status: values.status,
        validityPeriod: 30,

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

  // State for real-time calculations
  const [totals, setTotals] = useState({
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    total: 0,
  });

  // Calculate totals
  const calculateTotals = () => {
    const items = form.getValues("items");
    const subtotal = items.reduce(
      (sum, item) =>
        sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
      0
    );

    const discountType = form.getValues("discountType");
    const discountValue = Number(form.getValues("discountValue")) || 0;
    const taxType = form.getValues("taxType");
    const taxValue = Number(form.getValues("taxValue")) || 0;

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

    const calculatedTotals = {
      subtotal: isNaN(subtotal) ? 0 : subtotal,
      discountAmount: isNaN(discountAmount) ? 0 : discountAmount,
      taxAmount: isNaN(taxAmount) ? 0 : taxAmount,
      total: isNaN(total) ? 0 : total,
    };

    setTotals(calculatedTotals);
    return calculatedTotals;
  };

  // Watch for changes in form values and update totals
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value) {
        calculateTotals();
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

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

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Quote Status and Details */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
              <CardTitle>Quote Status</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowQuoteStatus(!showQuoteStatus)}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <Collapsible open={showQuoteStatus}>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quote Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="DRAFT">Draft</SelectItem>
                              <SelectItem value="PENDING">Pending</SelectItem>
                              <SelectItem value="APPROVED">Approved</SelectItem>
                              <SelectItem value="REJECTED">Rejected</SelectItem>
                              <SelectItem value="CONVERTED">
                                Converted
                              </SelectItem>
                              <SelectItem value="EXPIRED">Expired</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="validityPeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Validity Period (Days)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value?.toString() || ""}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                field.onChange(isNaN(value) ? 0 : value);
                                // Update validUntil date
                                const quoteDate = form.getValues("quoteDate");
                                if (quoteDate && !isNaN(value)) {
                                  const validUntil = new Date(quoteDate);
                                  validUntil.setDate(
                                    validUntil.getDate() + value
                                  );
                                  form.setValue("validUntil", validUntil);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="purchaseOrderNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purchase Order Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                {isLoadingBusinessInfo ? (
                  <BusinessInfoSkeleton />
                ) : (
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
                  </CardContent>
                )}
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">
                      Additional Information
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Add customer logo, shipping address and others data.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setShowAdditionalCustomerInfo(!showAdditionalCustomerInfo)
                    }
                  >
                    {showAdditionalCustomerInfo ? (
                      <span className="flex items-center gap-2">
                        <EyeOff /> Hide
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Eye /> Show
                      </span>
                    )}
                  </Button>
                </div>
              </div>
              {showAdditionalCustomerInfo && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-4">
                      {previewCustomerLogo ? (
                        <div className="relative">
                          <Image
                            src={previewCustomerLogo}
                            alt="Customer Logo"
                            width={80}
                            height={80}
                            className="h-20 w-auto rounded-md"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute -right-2 -top-2"
                            onClick={() => {
                              setPreviewCustomerLogo(null);
                              form.setValue("customerLogo", "");
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowCustomerLogoSelector(true)}
                        >
                          Upload Logo
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
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
                    name="billingAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shippingAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipping Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quote Items</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Item
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Description
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground">
                        Quantity
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground">
                        Unit Price
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground">
                        Total
                      </th>
                      <th className="w-[50px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => (
                      <tr key={field.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <FormField
                            control={form.control}
                            name={`items.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} placeholder="Item name" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <FormField
                            control={form.control}
                            name={`items.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} placeholder="Description" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="number"
                                    min="1"
                                    className="text-right"
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value));
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <FormField
                            control={form.control}
                            name={`items.${index}.unitPrice`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="text-right"
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value));
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="py-3 px-4 text-right text-foreground font-medium">
                          {(
                            (Number(
                              form.getValues(`items.${index}.quantity`)
                            ) || 0) *
                            (Number(
                              form.getValues(`items.${index}.unitPrice`)
                            ) || 0)
                          ).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="w-full flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() =>
                      append({
                        name: "",
                        description: "",
                        quantity: 1,
                        unitPrice: 0,
                        productId: "",
                        total: 0,
                        discountType: "percentage",
                        discountValue: 0,
                        taxType: "percentage",
                        taxValue: 0,
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>
              {/* Discount and Tax Section */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Discount</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="discountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="percentage">
                                Percentage (%)
                              </SelectItem>
                              <SelectItem value="fixed">
                                Fixed Amount
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="discountValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Value</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              step="0.01"
                              onChange={(e) => {
                                field.onChange(Number(e.target.value));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Tax</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="taxType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="percentage">
                                Percentage (%)
                              </SelectItem>
                              <SelectItem value="fixed">
                                Fixed Amount
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="taxValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Value</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              step="0.01"
                              onChange={(e) => {
                                field.onChange(Number(e.target.value));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Subtotal:
                  </span>
                  <span className="font-medium">
                    {totals.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Discount:
                  </span>
                  <span className="font-medium text-red-500">
                    -{totals.discountAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tax:</span>
                  <span className="font-medium">
                    {totals.taxAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-lg">
                    {totals.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
              <CardTitle>Notes & Terms</CardTitle>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotes(!showNotes)}
                >
                  <Settings2 className="h-4 w-4" />
                  Notes
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTerms(!showTerms)}
                >
                  <Settings2 className="h-4 w-4" />
                  Terms
                </Button>
              </div>
            </CardHeader>
            <Collapsible open={showNotes}>
              <CollapsibleContent>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Add any additional notes here..."
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible open={showTerms}>
              <CollapsibleContent>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="termsAndConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Terms and Conditions</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Add your terms and conditions here..."
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
