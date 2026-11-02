import Banner from "@/components/home/Banner";
import HowBorrowingWorks from "@/components/home/HowBorrowingWorks";
import NewArrivals from "@/components/home/NewArrivals";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F2EC]">
      <Banner />
      <HowBorrowingWorks />
      <NewArrivals />
    </div>
  );
}
