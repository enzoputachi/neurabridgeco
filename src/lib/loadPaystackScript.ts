// src/lib/loadPaystackScript.ts

let loading: Promise<void> | null = null;

export function loadPaystackScript(): Promise<void> {
  // Already loaded
  if ((window as any).PaystackPop) return Promise.resolve();
  // Already loading — reuse the same promise
  if (loading) return loading;

  loading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack script"));
    document.head.appendChild(script);
  });

  return loading;
}