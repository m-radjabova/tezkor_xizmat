import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-[#fff6f4]">
      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}