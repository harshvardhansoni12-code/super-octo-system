"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Circle,
  CloudSun,
  Droplets,
  Leaf,
  Menu,
  MessageCircle,
  Plus,
  Sprout,
  Tractor,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard-header";
import LiveChat from "@/components/live-chat";
import Sidebar from "@/components/shared/sidebar";
import SearchBar from "@/components/shared/search-bar";
import CropList from "@/components/user/crop-list";
import ListingTab from "@/components/shared/listing-tab";
import RecommendationPanel from "@/components/shared/recommendation-panel";
import NegotiationModal from "@/components/shared/negotiation-modal";
import OverviewAiChat from "@/components/shared/overview-ai-chat";
import OwnListings from "@/components/user/own-listings";
import ServiceSaleForm from "@/components/user/service-sale-form";
import GoodSaleForm from "@/components/user/good-sale-form";

const initialTasks = [
  { title: "Review crop health report", meta: "Today · Field A", done: true },
  { title: "Reply to the agronomist", meta: "Today · Advisory", done: true },
  {
    title: "Schedule irrigation check",
    meta: "Tomorrow · Field B",
    done: false,
  },
  {
    title: "Upload this week’s harvest log",
    meta: "Friday · Records",
    done: false,
  },
];

export default function UserDashboardClient({ session }) {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("Overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [cropQuery, setCropQuery] = useState("");
  const [negotiationTarget, setNegotiationTarget] = useState(null);
  const [serviceRefreshKey, setServiceRefreshKey] = useState(0);
  const [goodRefreshKey, setGoodRefreshKey] = useState(0);

  const firstName = (session.user.name || session.user.email || "farmer").split(
    " ",
  )[0];

  // Chat/Negotiate handlers are bound per listing type so ListingRow's
  // generic onChat(item)/onNegotiate(item) callbacks know what they're
  // acting on.
  function handleChat(itemType) {
    return (item) => router.push(`/chat?type=${itemType}&id=${item.id}`);
  }

  function handleNegotiate(itemType) {
    return (item) =>
      setNegotiationTarget({
        listingType: itemType,
        listingId: item.id,
        name: item.name,
      });
  }

  function renderContent() {
    switch (activeNav) {
      case "Overview":
        return <OverviewTab session={session} firstName={firstName} />;

      case "Crops":
        return (
          <>
            <SearchBar
              placeholder="Search crops"
              onSearch={setCropQuery}
              className="mb-6 sm:w-64"
            />
            <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
              <CropList
                title="Crops on sale"
                description="Browse crops currently listed on the platform."
                query={cropQuery}
                interactive
                onChat={handleChat("crop")}
                onNegotiate={handleNegotiate("crop")}
              />
              <RecommendationPanel type="crop" />
            </div>
          </>
        );

      case "Services":
        return (
          <>
            <ListingTab
              itemType="service"
              endpoint="/api/v1/user/services/all"
              dataKey="services"
              title="Services"
              description="Farm services you can hire — ploughing, irrigation, pest control, and more."
              searchPlaceholder="Search services"
              emptyLabel="No services found"
              interactive
              onChat={handleChat("service")}
              onNegotiate={handleNegotiate("service")}
              showRecommendations
              recommendationType="service"
            />

            <div className="mt-10 space-y-5">
              <OwnListings
                key={serviceRefreshKey}
                endpoint="/api/v1/user/services/all"
                dataKey="services"
                itemType="service"
                providerIdKey="serviceProviderId"
                userId={session.user.id}
                title="Your services"
                description="Services you've listed on the platform."
                emptyLabel="You haven't listed any services yet."
              />

              <ServiceSaleForm
                onCreated={() => setServiceRefreshKey((current) => current + 1)}
              />
            </div>
          </>
        );

      case "Goods":
        return (
          <>
            <ListingTab
              itemType="good"
              endpoint="/api/v1/user/goods/all"
              dataKey="goods"
              title="Goods"
              description="Seeds, fertilizers, equipment, and other inputs from suppliers."
              searchPlaceholder="Search goods"
              emptyLabel="No goods found"
              interactive
              onChat={handleChat("good")}
              onNegotiate={handleNegotiate("good")}
              showRecommendations
              recommendationType="good"
            />

            <div className="mt-10 space-y-5">
              <OwnListings
                key={goodRefreshKey}
                endpoint="/api/v1/user/goods/all"
                dataKey="goods"
                itemType="good"
                providerIdKey="goodProviderId"
                userId={session.user.id}
                title="Your goods"
                description="Goods you've listed on the platform."
                emptyLabel="You haven't listed any goods yet."
              />

              <GoodSaleForm
                onCreated={() => setGoodRefreshKey((current) => current + 1)}
              />
            </div>
          </>
        );

      case "Buyers":
        return (
          <ListingTab
            itemType="buyer"
            endpoint="/api/v1/user/buyers/all"
            dataKey="buyers"
            title="Buyers"
            description="Buyers and companies looking to purchase from growers like you."
            searchPlaceholder="Search buyers"
            emptyLabel="No buyers found"
            interactive
            onChat={handleChat("buyer")}
            onNegotiate={handleNegotiate("buyer")}
            showRecommendations
            recommendationType="buyer"
          />
        );

      case "Profile":
        return <ProfileTab session={session} />;

      default:
        return <OverviewTab session={session} firstName={firstName} />;
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f5ef] text-[#19352a]">
      <DashboardHeader
        label="Grower workspace"
        className="overflow-hidden rounded-b-2xl border-b border-[#dbe5dc] bg-[#f4f5ef] px-5 py-4 sm:px-8"
        name={session.user.name || session.user.email}
      />

      <div className="mx-auto flex max-w-[1440px]">
        <Sidebar
          role="USER"
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          mobileNav={mobileNav}
          setMobileNav={setMobileNav}
        />

        <section className="min-w-0 flex-1 px-5 py-6 sm:px-8 sm:py-8">
          <div className="mb-5 flex items-center justify-between sm:hidden">
            <button
              aria-label="Open navigation"
              onClick={() => setMobileNav(true)}
              className="rounded-lg bg-white p-2 shadow-sm"
            >
              <Menu className="size-5" />
            </button>
            <div className="flex gap-2">
              <button
                aria-label="Notifications"
                className="rounded-lg bg-white p-2 shadow-sm"
              >
                <Bell className="size-4" />
              </button>
              <span className="flex size-8 items-center justify-center rounded-full bg-[#f0bd2f] text-xs font-bold">
                {firstName[0]}
              </span>
            </div>
          </div>

          {renderContent()}
        </section>
      </div>

      <NegotiationModal
        target={negotiationTarget}
        onClose={() => setNegotiationTarget(null)}
      />
    </main>
  );
}

function OverviewTab({ session, firstName }) {
  const [tasks, setTasks] = useState(initialTasks);

  function toggleTask(index) {
    setTasks((current) =>
      current.map((task, taskIndex) =>
        taskIndex === index ? { ...task, done: !task.done } : task,
      ),
    );
  }

  const completed = tasks.filter((task) => task.done).length;

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6e8c61]">
            Sunday, August 30, 2026
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Good morning, {firstName}.
          </h1>
          <p className="mt-2 text-sm text-[#718078]">
            Here’s what’s happening across your farm today.
          </p>
        </div>
        <button className="hidden items-center gap-2 rounded-lg bg-[#eab92d] px-4 py-2.5 text-xs font-bold text-[#24351c] shadow-sm transition hover:bg-[#f2c83e] sm:flex">
          <Plus className="size-4" /> Add a record
        </button>
      </div>
      <div className="mt-7 grid overflow-hidden rounded-2xl bg-[#214a38] text-white shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-64 overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-0 bg-[url('/loginBackground.jpg')] bg-cover bg-[center_65%] opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#173b2b] via-[#173b2b]/70 to-transparent" />
          <div className="relative max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#e5efcf]">
              <Sprout className="size-3" /> Field intelligence
            </span>
            <h2 className="mt-8 text-3xl font-semibold leading-tight tracking-[-0.04em]">
              Grow with a clearer view of your land.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#d2e0cf]">
              Small signals become stronger harvests. Your latest field data
              is ready to review.
            </p>
            <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#f0c22e]">
              Open field report <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 bg-[#2c6245] p-6 sm:p-8">
          <div className="border-b border-white/15 pb-5">
            <p className="text-xs text-[#b9d1b8]">Field A health</p>
            <p className="mt-2 text-4xl font-semibold">
              86<span className="text-xl">%</span>
            </p>
            <p className="mt-1 text-xs text-[#f0c22e]">↑ 12% this month</p>
          </div>
          <div className="border-b border-l border-white/15 pb-5 pl-5">
            <CloudSun className="size-5 text-[#f0c22e]" />
            <p className="mt-2 text-2xl font-semibold">24°C</p>
            <p className="mt-1 text-xs text-[#b9d1b8]">Clear skies today</p>
          </div>
          <div className="pt-5">
            <Droplets className="size-5 text-[#b9d1b8]" />
            <p className="mt-2 text-2xl font-semibold">68%</p>
            <p className="mt-1 text-xs text-[#b9d1b8]">Soil moisture</p>
          </div>
          <div className="border-l border-white/15 pt-5 pl-5">
            <Tractor className="size-5 text-[#f0c22e]" />
            <p className="mt-2 text-2xl font-semibold">3.4 ha</p>
            <p className="mt-1 text-xs text-[#b9d1b8]">Under management</p>
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-2xl border border-[#dce4d8] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c9c8a]">
                Your day
              </p>
              <h2 className="mt-1 text-xl font-semibold">Today’s focus</h2>
            </div>
            <span className="rounded-full bg-[#edf3e8] px-3 py-1 text-xs font-semibold text-[#5c7c4f]">
              {completed} of {tasks.length} done
            </span>
          </div>
          <div className="mt-5 space-y-2">
            {tasks.map((task, index) => (
              <button
                key={task.title}
                onClick={() => toggleTask(index)}
                className="flex w-full items-center gap-3 rounded-xl border border-transparent bg-[#f7f9f5] p-3 text-left transition hover:border-[#c7d8bd]"
              >
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${task.done ? "border-[#6b934d] bg-[#6b934d] text-white" : "border-[#c8d4c5] text-transparent"}`}
                >
                  {task.done ? (
                    <Check className="size-3.5" />
                  ) : (
                    <Circle className="size-3" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-sm font-medium ${task.done ? "text-[#829084] line-through" : "text-[#294436]"}`}
                  >
                    {task.title}
                  </span>
                  <span className="mt-1 block text-[11px] text-[#92a095]">
                    {task.meta}
                  </span>
                </span>
                <ChevronRight className="size-4 text-[#a6b4a5]" />
              </button>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-[#dce4d8] bg-[#fffdf4] p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a48639]">
                Coming up
              </p>
              <h2 className="mt-1 text-xl font-semibold">Next check-in</h2>
            </div>
            <CalendarDays className="size-5 text-[#bb921b]" />
          </div>
          <p className="mt-8 text-2xl font-semibold text-[#5d552f]">
            Tomorrow · 10:30 AM
          </p>
          <p className="mt-2 text-sm leading-6 text-[#817752]">
            Team planning and irrigation review with your field advisor.
          </p>
          <div className="mt-6 flex items-center justify-between border-t border-[#ede4bd] pt-4 text-xs font-semibold text-[#92761b]">
            <span>45 min session</span>
            <button className="flex items-center gap-1">
              View calendar <ChevronRight className="size-3" />
            </button>
          </div>
        </section>
      </div>
      <section className="mt-5 rounded-2xl border border-[#dce4d8] bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="size-5 text-[#668b45]" />
            <h2 className="text-lg font-semibold">Your field team</h2>
          </div>
          <span className="text-xs text-[#829084]">
            3 updates this week
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-3 rounded-lg bg-[#f7f9f5] px-3 py-2 text-sm">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#dcebc9] text-xs font-bold text-[#477536]">
              RK
            </span>
            <span>
              <b className="block font-medium">Rajesh Kumar</b>
              <small className="text-xs text-[#829084]">
                Agronomist · Online
              </small>
            </span>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-dashed border-[#c5d2c2] px-4 py-2 text-xs font-semibold text-[#5c7c4f] hover:bg-[#f4f8f0]">
            <MessageCircle className="size-4" /> Message team
          </button>
        </div>
      </section>
      <div className="mt-5">
        <OverviewAiChat />
      </div>
      <div className="mt-5">
        <LiveChat currentUserId={session.user.id} />
      </div>
    </>
  );
}

function ProfileTab({ session }) {
  const initials = (session.user.name || session.user.email || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const joinedDate = session.user.createdAt
    ? new Date(session.user.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6e8c61]">
        Workspace
      </p>

      <h1 className="mt-2 text-3xl font-semibold tracking-tighter sm:text-5xl">
        Profile
      </h1>

      <div className="mt-7 rounded-2xl border border-[#dce4d8] bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-full bg-[#dcebc9] text-xl font-bold text-[#477536]">
            {initials}
          </span>

          <div>
            <p className="text-xl font-semibold text-[#19352a]">
              {session.user.name || "Not specified"}
            </p>
            <p className="mt-1 text-sm text-[#718078]">
              {session.user.email}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-[#edf1ed] pt-6 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c9c8a]">
              Role
            </p>
            <p className="mt-1 text-sm font-semibold text-[#19352a]">
              {session.user.role === "USER" ? "Grower" : session.user.role}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c9c8a]">
              Email
            </p>
            <p className="mt-1 text-sm font-semibold text-[#19352a]">
              {session.user.email}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c9c8a]">
              Joined
            </p>
            <p className="mt-1 text-sm font-semibold text-[#19352a]">
              {joinedDate}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        <CropList
          title="Your crops"
          description="Crops you've listed for sale."
          interactive={false}
        />

        <OwnListings
          endpoint="/api/v1/user/services/all"
          dataKey="services"
          itemType="service"
          providerIdKey="serviceProviderId"
          userId={session.user.id}
          title="Your services"
          description="Services you've listed on the platform."
          emptyLabel="You haven't listed any services yet."
        />

        <OwnListings
          endpoint="/api/v1/user/goods/all"
          dataKey="goods"
          itemType="good"
          providerIdKey="goodProviderId"
          userId={session.user.id}
          title="Your goods"
          description="Goods you've listed on the platform."
          emptyLabel="You haven't listed any goods yet."
        />
      </div>
    </section>
  );
}
