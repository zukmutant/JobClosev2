"use client";

import {
  Button,
  Checkbox,
  Fieldset,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type FormPanelProps = Omit<ComponentPropsWithoutRef<"form">, "style" | "className"> & {
  children: ReactNode;
};

type UiTextInputProps = Omit<ComponentPropsWithoutRef<"input">, "style" | "className" | "size"> & {
  label: string;
};

type StatusTone = "neutral" | "success" | "error";

export function FormPanel({ children, ...props }: Readonly<FormPanelProps>) {
  return (
    <form {...props}>
      <Paper w="min(100%, 720px)" p="xl" radius="sm" shadow="md" withBorder bg="white">
        <Stack gap="xl">{children}</Stack>
      </Paper>
    </form>
  );
}

export function FormTitle({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Title order={1} c="gray.9" size="h2">
      {children}
    </Title>
  );
}

export function FormGrid({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
      {children}
    </SimpleGrid>
  );
}

export function FormGridFull({ children }: Readonly<{ children: ReactNode }>) {
  return <Stack style={{ gridColumn: "1 / -1" }}>{children}</Stack>;
}

export function UiTextInput({ label, ...props }: Readonly<UiTextInputProps>) {
  return <TextInput label={label} size="md" {...props} />;
}

export function CheckboxSet({
  legend,
  children,
}: Readonly<{
  legend: string;
  children: ReactNode;
}>) {
  return (
    <Fieldset legend={legend} radius="sm">
      <Group gap="md">{children}</Group>
    </Fieldset>
  );
}

export function UiCheckbox({
  label,
  ...props
}: Readonly<Omit<ComponentPropsWithoutRef<"input">, "style" | "className" | "size" | "type"> & {
  label: string;
}>) {
  return <Checkbox label={label} {...props} />;
}

export function FormFooter({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Group gap="md" align="center">
      {children}
    </Group>
  );
}

export function UiSubmitButton({
  children,
  disabled,
}: Readonly<{
  children: ReactNode;
  disabled?: boolean;
}>) {
  return (
    <Button type="submit" color="teal" radius="sm" disabled={disabled}>
      {children}
    </Button>
  );
}

export function FormStatus({
  children,
  tone,
}: Readonly<{
  children: ReactNode;
  tone: StatusTone;
}>) {
  const color = tone === "success" ? "teal.8" : tone === "error" ? "red.8" : "gray.7";

  return (
    <Text component="p" aria-live="polite" c={color} fw={tone === "neutral" ? 400 : 600} mih={22}>
      {children}
    </Text>
  );
}
