import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, insertCarSchema, InsertCar } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import {
  createCarFirebase,
  getCarByIdFirebase,
  updateCarFirebase,
} from "@/lib/carsFirebase";
import {
  uploadImage,
  uploadImages,
  isImageFile,
  isValidFileSize,
  createImagePreview,
  revokeImagePreview,
} from "@/lib/imageUpload";

const categories = ["Sedan", "SUV", "Sports", "Luxury", "Electric", "Compact"];
const transmissions = ["Automatic", "Manual"];
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];

export default function CarForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEdit = !!id;
  
  // State for file uploads and previews
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [originalMainImageUrl, setOriginalMainImageUrl] = useState<string | null>(null);

  const { data: car, isLoading, error } = useQuery<Car>({
    queryKey: ["carById", id],
    enabled: isEdit,
    queryFn: () => getCarByIdFirebase(id!),
  });

  const form = useForm<InsertCar>({
    resolver: zodResolver(insertCarSchema),
    defaultValues: {
      name: "",
      category: "Sedan",
      description: "",
      image: "",
      images: [],
      pricePerDay: 0,
      seats: 5,
      transmission: "Automatic",
      fuelType: "Petrol",
      luggage: 2,
      doors: 4,
      year: new Date().getFullYear(),
      hasGPS: false,
      hasBluetooth: false,
      hasAC: true,
      hasUSB: false,
      available: true,
    },
  });

  // Only reset the form when car data is loaded and the form hasn't been modified
  useEffect(() => {
    if (isEdit && car && !form.formState.isDirty) {
      form.reset({
        name: car.name,
        category: car.category,
        description: car.description,
        image: car.image,
        images: car.images || [],
        pricePerDay: car.pricePerDay,
        seats: car.seats,
        transmission: car.transmission,
        fuelType: car.fuelType,
        luggage: car.luggage,
        doors: car.doors,
        year: car.year,
        hasGPS: car.hasGPS,
        hasBluetooth: car.hasBluetooth,
        hasAC: car.hasAC,
        hasUSB: car.hasUSB,
        available: car.available,
      });
      // Store the original image URL to preserve it if no new file is uploaded
      setOriginalMainImageUrl(car.image);
    }
  }, [car, isEdit, form, form.formState.isDirty]);

  const createMutation = useMutation({
    mutationFn: (data: InsertCar) => createCarFirebase(data),
    onSuccess: () => {
      setIsUploading(false);
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      toast({
        title: "Success",
        description: "Car created successfully",
      });
      setLocation("/admin/cars");
    },
    onError: () => {
      setIsUploading(false);
      toast({
        title: "Error",
        description: "Failed to create car",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertCar) => updateCarFirebase(id!, data),
    onSuccess: () => {
      setIsUploading(false);
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["carById", id] });
      toast({
        title: "Success",
        description: "Car updated successfully",
      });
      setLocation("/admin/cars");
    },
    onError: () => {
      setIsUploading(false);
      toast({
        title: "Error",
        description: "Failed to update car",
        variant: "destructive",
      });
    },
  });

  // Helper to check if a URL is a blob URL (preview URL)
  const isBlobUrl = (url: string | null | undefined): boolean => {
    return url ? url.startsWith("blob:") : false;
  };

  const onSubmit = async (data: InsertCar) => {
    setIsUploading(true);
    try {
      // Upload main image if a new file was selected
      let mainImageUrl = data.image;
      
      // If a new file was selected, upload it
      if (mainImageFile) {
        if (!isImageFile(mainImageFile)) {
          toast({
            title: "Error",
            description: "Main image must be a valid image file",
            variant: "destructive",
          });
          setIsUploading(false);
          return;
        }
        if (!isValidFileSize(mainImageFile)) {
          toast({
            title: "Error",
            description: "Main image must be less than 5MB",
            variant: "destructive",
          });
          setIsUploading(false);
          return;
        }
        mainImageUrl = await uploadImage(mainImageFile);
      } else if (isBlobUrl(data.image)) {
        // If the form has a blob URL but no file, use the original URL (when editing)
        mainImageUrl = originalMainImageUrl || data.image;
      } else if (!data.image && originalMainImageUrl) {
        // If image field is empty but we have an original URL, keep it
        mainImageUrl = originalMainImageUrl;
      }

      // Upload additional images if files were selected
      let additionalImageUrls = data.images || [];
      if (additionalImageFiles.length > 0) {
        // Validate all files
        for (const file of additionalImageFiles) {
          if (!isImageFile(file)) {
            toast({
              title: "Error",
              description: "All images must be valid image files",
              variant: "destructive",
            });
            setIsUploading(false);
            return;
          }
          if (!isValidFileSize(file)) {
            toast({
              title: "Error",
              description: "All images must be less than 5MB",
              variant: "destructive",
            });
            setIsUploading(false);
            return;
          }
        }
        const uploadedUrls = await uploadImages(additionalImageFiles);
        // Filter out blob URLs from existing images and merge with new uploads
        const validExistingUrls = (data.images || []).filter(url => !isBlobUrl(url));
        additionalImageUrls = [...validExistingUrls, ...uploadedUrls];
      } else {
        // Filter out any blob URLs that might be in the form data
        additionalImageUrls = (data.images || []).filter(url => !isBlobUrl(url));
      }

      // Submit with uploaded URLs
      const submitData: InsertCar = {
        ...data,
        image: mainImageUrl,
        images: additionalImageUrls,
      };

      if (isEdit) {
        updateMutation.mutate(submitData);
      } else {
        createMutation.mutate(submitData);
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  // Handle main image file selection
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isImageFile(file)) {
        toast({
          title: "Invalid File",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      if (!isValidFileSize(file)) {
        toast({
          title: "File Too Large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setMainImageFile(file);
      const preview = createImagePreview(file);
      setMainImagePreview(preview);
      // Don't update form field with blob URL - keep original URL or empty
      // The blob URL is only for preview, actual upload happens on submit
    }
  };

  // Handle additional images file selection
  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate all files
    for (const file of files) {
      if (!isImageFile(file)) {
        toast({
          title: "Invalid File",
          description: "All files must be image files",
          variant: "destructive",
        });
        return;
      }
      if (!isValidFileSize(file)) {
        toast({
          title: "File Too Large",
          description: "All images must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
    }

    setAdditionalImageFiles((prev) => [...prev, ...files]);
    const previews = files.map((file) => createImagePreview(file));
    setAdditionalImagePreviews((prev) => [...prev, ...previews]);
  };

  // Remove additional image (file or URL)
  const removeAdditionalImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    const isFileIndex = index < additionalImageFiles.length;
    
    if (isFileIndex) {
      // Remove from files
      const newFiles = [...additionalImageFiles];
      const removedFile = newFiles.splice(index, 1)[0];
      setAdditionalImageFiles(newFiles);
      
      // Revoke preview URL
      const newPreviews = [...additionalImagePreviews];
      const removedPreview = newPreviews.splice(index, 1)[0];
      revokeImagePreview(removedPreview);
      setAdditionalImagePreviews(newPreviews);
    } else {
      // Remove from URL array
      const urlIndex = index - additionalImageFiles.length;
      const newImages = currentImages.filter((_, i) => i !== urlIndex);
      form.setValue("images", newImages, { shouldDirty: true });
    }
  };

  // Add URL field for additional images
  const addImageUrlField = () => {
    const currentImages = form.getValues("images") || [];
    form.setValue("images", [...currentImages, ""], { shouldDirty: true });
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (mainImagePreview) revokeImagePreview(mainImagePreview);
      additionalImagePreviews.forEach(revokeImagePreview);
    };
  }, [mainImagePreview, additionalImagePreviews]);

  if (isEdit && isLoading) {
    return (
      <div className="max-w-4xl">
        <Skeleton className="h-10 w-48 mb-8" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isEdit && error) {
    console.error("Error loading car:", error);
    return (
      <div className="max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => setLocation("/admin/cars")}
          className="mb-8"
          data-testid="button-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cars
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Car Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The car you're looking for doesn't exist or may have been deleted.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Car ID: {id}
              </p>
              <Button onClick={() => setLocation("/admin/cars")}>
                Back to Cars List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => setLocation("/admin/cars")}
        className="mb-8"
        data-testid="button-back"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cars
      </Button>

      <h1 className="text-4xl font-bold mb-8">
        {isEdit ? "Edit Car" : "Add New Car"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Car Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Tesla Model 3" {...field} data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the car's features and highlights..."
                        className="min-h-24"
                        {...field}
                        data-testid="input-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Image</FormLabel>
                    <div className="space-y-4">
                      {/* File Upload */}
                      <div className="flex flex-col gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageChange}
                          className="cursor-pointer"
                          data-testid="input-image-file"
                        />
                        <FormDescription>
                          Upload an image file (max 5MB) or use URL below
                        </FormDescription>
                      </div>
                      
                      {/* URL Input (fallback) */}
                      <div className="space-y-2">
                        <FormLabel className="text-sm text-muted-foreground">Or enter image URL:</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/car.jpg"
                            value={field.value || ""}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              // Clear file if URL is entered
                              if (e.target.value && mainImageFile) {
                                setMainImageFile(null);
                                if (mainImagePreview) {
                                  revokeImagePreview(mainImagePreview);
                                  setMainImagePreview(null);
                                }
                              }
                            }}
                            data-testid="input-image-url"
                          />
                        </FormControl>
                      </div>
                      
                      {/* Preview */}
                      {(mainImagePreview || field.value) && (
                        <div className="relative w-full max-w-md">
                          <img
                            src={mainImagePreview || field.value}
                            alt="Main image preview"
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                          {mainImageFile && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                setMainImageFile(null);
                                if (mainImagePreview) {
                                  revokeImagePreview(mainImagePreview);
                                  setMainImagePreview(null);
                                }
                                form.setValue("image", "", { shouldDirty: true });
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Additional Images</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesChange}
                      className="cursor-pointer w-auto"
                      data-testid="input-additional-images-file"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addImageUrlField}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add URL
                    </Button>
                  </div>
                </div>
                <FormDescription>
                  Upload image files (max 5MB each) or add image URLs
                </FormDescription>
                
                {/* File upload previews */}
                {additionalImagePreviews.map((preview, index) => (
                  <div key={`file-${index}`} className="flex gap-2 items-start">
                    <div className="relative flex-1">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => removeAdditionalImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {/* URL inputs */}
                {form.watch("images") && form.watch("images")!.map((url, index) => (
                  <div key={`url-${index}`} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`images.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <div className="flex gap-2">
                              <Input
                                placeholder={`Image URL ${index + 1}`}
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                data-testid={`input-additional-image-url-${index}`}
                              />
                              {field.value && (
                                <div className="w-32 h-20 rounded-lg border overflow-hidden">
                                  <img
                                    src={field.value}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                  />
                                </div>
                              )}
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeAdditionalImage(additionalImageFiles.length + index)}
                                className="shrink-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="pricePerDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Per Day ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                          data-testid="input-price"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                          data-testid="input-year"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="transmission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transmission</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-transmission">
                            <SelectValue placeholder="Select transmission" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {transmissions.map((trans) => (
                            <SelectItem key={trans} value={trans}>
                              {trans}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fuelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-fuel-type">
                            <SelectValue placeholder="Select fuel type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fuelTypes.map((fuel) => (
                            <SelectItem key={fuel} value={fuel}>
                              {fuel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="seats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seats</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                          data-testid="input-seats"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doors</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                          data-testid="input-doors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="luggage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Luggage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                          data-testid="input-luggage"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features & Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="hasGPS"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">GPS Navigation</FormLabel>
                        <FormDescription>Built-in GPS system</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-gps"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasBluetooth"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Bluetooth</FormLabel>
                        <FormDescription>Wireless connectivity</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-bluetooth"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasAC"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Air Conditioning</FormLabel>
                        <FormDescription>Climate control</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-ac"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasUSB"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">USB Ports</FormLabel>
                        <FormDescription>Device charging</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-usb"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Available for Rent</FormLabel>
                      <FormDescription>
                        Toggle to make this car available or unavailable
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-available"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              size="lg"
              disabled={createMutation.isPending || updateMutation.isPending || isUploading}
              data-testid="button-submit"
            >
              <Save className="mr-2 h-4 w-4" />
              {isUploading
                ? "Uploading Images..."
                : createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : isEdit
                ? "Update Car"
                : "Create Car"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setLocation("/admin/cars")}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}