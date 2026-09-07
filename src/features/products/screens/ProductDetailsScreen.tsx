import { useCallback, useState } from "react";
import { View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  DocumentTextIcon,
  CurrencyDollarIcon,
} from "react-native-heroicons/outline";

import { useProductDetails } from "../hooks/useProductDetails";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { getFieldErrorMessage } from "@/src/shared/api/errors";
import { ROUTES } from "@/src/shared/navigation/routes";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import {
  Text,
  Button,
  Badge,
  Spinner,
  ConfirmDialog,
  InfoDialog,
  InfoListRow,
} from "@/src/shared/ui";

export default function ProductDetailsScreen() {
  const { productSlug } = useLocalSearchParams<{ productSlug: string }>();
  const [limitErrorMessage, setLimitErrorMessage] = useState<string | null>(
    null,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const productDetails = useProductDetails(productSlug);
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();

  useFocusEffect(
    useCallback(() => {
      productDetails.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productSlug]),
  );

  function handleConfirmDelete() {
    deleteProduct.mutate(productSlug, {
      onSuccess: () => {
        router.replace(ROUTES.invoices.products.list);
      },
    });
  }

  function handleArchive() {
    updateProduct.mutate({
      slug: productSlug,
      payload: { is_archived: true },
    });
  }

  function handleUnarchive() {
    updateProduct.mutate(
      { slug: productSlug, payload: { is_archived: false } },
      {
        onError: (error) => {
          setLimitErrorMessage(getFieldErrorMessage(error));
        },
      },
    );
  }

  if (productDetails.isLoading) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Product"
          showBackButton
          containerVariant="desktop"
        />
        <Container variant="narrow" safeArea="bottom">
          <View className="flex-1 items-center justify-center">
            <Spinner />
          </View>
        </Container>
      </View>
    );
  }

  if (productDetails.isError) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Product"
          showBackButton
          containerVariant="desktop"
        />
        <Container variant="narrow" safeArea="bottom">
          <View className="flex-1 items-center justify-center gap-3">
            <Text variant="body" className="text-muted-foreground">
              Product not found.
            </Text>
            <Button
              variant="outline"
              title="Back to Products"
              onPress={() => router.replace(ROUTES.invoices.products.list)}
            />
          </View>
        </Container>
      </View>
    );
  }

  const product = productDetails.data;
  const isArchived = product?.is_archived ?? false;

  // Description and unit price are both optional — this finds whichever
  // populated field is actually last, same approach as Business
  // Profile's GST/VAT handling.
  const lastFieldKey = product
    ? (
        [
          ["description", product.description],
          ["unit_price", product.unit_price],
        ] as const
      )
        .filter(([, value]) => !!value)
        .at(-1)?.[0]
    : undefined;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Product" showBackButton containerVariant="desktop" />

      <Container variant="narrow" safeArea="bottom" scroll>
        <View className="px-6 py-6 gap-6">
          <View className="items-center gap-1">
            <Text variant="heading" className="text-center">
              {product?.title}
            </Text>
            {isArchived && <Badge label="Archived" variant="default" />}
          </View>

          <View className="bg-card border border-border rounded-lg px-4">
            <InfoListRow
              icon={DocumentTextIcon}
              label="Description"
              value={product?.description}
              isLast={lastFieldKey === "description"}
            />
            <InfoListRow
              icon={CurrencyDollarIcon}
              label="Unit Price"
              value={product?.unit_price ? `₹${product.unit_price}` : undefined}
              isLast={lastFieldKey === "unit_price"}
            />
          </View>

          <View className="gap-3">
            {!isArchived && (
              <Button
                variant="primary"
                title="Edit Product"
                onPress={() =>
                  router.push(ROUTES.invoices.products.edit(productSlug))
                }
              />
            )}

            {isArchived ? (
              <Button
                variant="outline"
                title="Unarchive Product"
                onPress={handleUnarchive}
                isLoading={updateProduct.isPending}
              />
            ) : (
              <Button
                variant="outline"
                title="Archive Product"
                onPress={handleArchive}
                isLoading={updateProduct.isPending}
              />
            )}

            <Button
              variant="destructive"
              title="Delete Product"
              onPress={() => setShowDeleteConfirm(true)}
            />
          </View>
        </View>
      </Container>

      <ConfirmDialog
        visible={showDeleteConfirm}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        isConfirming={deleteProduct.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <InfoDialog
        visible={limitErrorMessage !== null}
        title="Cannot Unarchive"
        message={limitErrorMessage ?? ""}
        onDismiss={() => setLimitErrorMessage(null)}
      />
    </View>
  );
}
