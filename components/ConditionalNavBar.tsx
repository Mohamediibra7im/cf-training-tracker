"use client";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import useUser from "@/hooks/useUser";

type ConditionalNavBarProps = {
  children: React.ReactNode;
};

const ConditionalNavBar = ({ children }: ConditionalNavBarProps) => {
  const { user, isLoading } = useUser();

  const showNavbar = !isLoading && user !== null;

  return (
    <>
      {showNavbar && <NavBar />}
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 max-w-7xl">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ConditionalNavBar;
