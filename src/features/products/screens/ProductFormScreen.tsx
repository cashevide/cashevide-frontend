import { useEffect, useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useProductDetails } from "../hooks/useProductDetails";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { getFieldErrorMessage } from "@/src/shared/api/errors";
import { ROUTES } from "@/src/shared/navigation/routes";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import { Text, Input, Button, Spinner } from "@/src/shared/ui";

export default function ProductFormScreen() {
  const { productSlug } = useLocalSearchParams<{ productSlug?: string }>();
  const isEditMode = Boolean(productSlug);

  const productDetails = useProductDetails(productSlug ?? "");
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  useEffect(() => {
    if (isEditMode && productDetails.data) {
      setTitle(productDetails.data.title);
      setDescription(productDetails.data.description);
      setUnitPrice(productDetails.data.unit_price);
    }
  }, [isEditMode, productDetails.data]);

  const mutation = isEditMode ? updateProduct : createProduct;
  const errorMessage = mutation.isError
    ? getFieldErrorMessage(mutation.error)
    : null;

  function handleSave() {
    if (isEditMode && productSlug) {
      updateProduct.mutate(
        {
          slug: productSlug,
          payload: { title, description, unit_price: unitPrice },
        },
        {
          onSuccess: (data) => {
            router.replace(ROUTES.invoices.products.detail(data.slug));
          },
        },
      );
      return;
    }

    createProduct.mutate(
      { title, description, unit_price: unitPrice },
      {
        onSuccess: (data) => {
          router.replace(ROUTES.invoices.products.detail(data.slug));
        },
      },
    );
  }

  if (isEditMode && productDetails.isLoading) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Edit Product"
          showBackButton
          containerVariant="desktop"
        />
        <Container variant="desktop" safeArea="bottom">
          <View className="flex-1 items-center justify-center">
            <Spinner />
          </View>
        </Container>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title={isEditMode ? "Edit Product" : "Add Product"}
        showBackButton
        containerVariant="desktop"
      />

      <Container variant="desktop" safeArea="bottom" scroll>
        <View className="gap-4 px-6 py-6">
          <Input placeholder="Title" value={title} onChangeText={setTitle} />

          <Input
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Input
            placeholder="Unit Price"
            keyboardType="decimal-pad"
            value={unitPrice}
            onChangeText={setUnitPrice}
          />

          {errorMessage && (
            <Text variant="body-sm" className="text-center text-destructive">
              {errorMessage}
            </Text>
          )}

          <Button
            variant="primary"
            title={isEditMode ? "Save Changes" : "Create Product"}
            onPress={handleSave}
            disabled={!title.trim() || !unitPrice.trim()}
            isLoading={mutation.isPending}
          />
        </View>
      </Container>
    </View>
  );
}
