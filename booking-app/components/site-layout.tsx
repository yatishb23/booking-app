"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { CategoryBar } from "@/components/category-bar";
import { CitySelectorModal } from "@/components/city-selector-modal";

interface SiteLayoutProps {
  children: React.ReactNode;
}

function SiteLayoutContent({ children }: SiteLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";

  const [selectedCity, setSelectedCity] = useState<string>("");
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  useEffect(() => {
    // Only access localStorage on the client
    const savedCity = localStorage.getItem("selectedCity");
    if (savedCity) {
      setSelectedCity(savedCity);
    } else {
      setIsCityModalOpen(true);
    }
  }, []);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    localStorage.setItem("selectedCity", city);
    setIsCityModalOpen(false);
  };

  const handleSelectCategory = (category: string) => {
    if (category === "All" || category === "") {
        router.push("/");
    } else {
        router.push(`/?category=${category}`);
    }
  };

  return (
    <>
      <SiteHeader
        selectedCity={selectedCity}
        onSelectCity={() => setIsCityModalOpen(true)}
      />
      <CitySelectorModal open={isCityModalOpen} onSelect={handleCitySelect} />
      
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />
      
      <main className="flex-1">{children}</main>
    </>
  );
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SiteLayoutContent>{children}</SiteLayoutContent>
    </Suspense>
  );
}
