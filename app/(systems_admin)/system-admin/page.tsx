import React from "react";

const SystemAdminPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Educational System Administration
        </h1>
        <p className="text-muted-foreground">
          Welcome to the central management portal for your educational
          institution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Dashboard Cards */}
        <DashboardCard
          title="Students"
          value="2,845"
          description="Currently enrolled"
          trend="up"
          percentage="5.2"
        />

        <DashboardCard
          title="Teachers"
          value="164"
          description="Active faculty"
          trend="up"
          percentage="2.1"
        />

        <DashboardCard
          title="Classes"
          value="246"
          description="Ongoing this term"
          trend="up"
          percentage="8.3"
        />

        <DashboardCard
          title="Attendance"
          value="93.8%"
          description="Average this week"
          trend="up"
          percentage="1.2"
        />

        <DashboardCard
          title="Academic Performance"
          value="B+"
          description="Average grade"
          trend="up"
          percentage="3.4"
        />

        <DashboardCard
          title="Support Tickets"
          value="12"
          description="Awaiting response"
          trend="down"
          percentage="28.5"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 border rounded-lg p-6 bg-white">
          <h2 className="text-lg font-medium mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            <EventItem
              title="End of Term Exams"
              date="April 15-26, 2025"
              description="Final examinations for all grades"
              type="academic"
            />
            <EventItem
              title="Parent-Teacher Conference"
              date="April 8, 2025"
              description="Quarterly progress review with parents"
              type="meeting"
            />
            <EventItem
              title="Professional Development Day"
              date="April 12, 2025"
              description="Faculty training on new learning technologies"
              type="training"
            />
            <EventItem
              title="Spring Sports Tournament"
              date="April 18-20, 2025"
              description="Inter-school sports competition"
              type="event"
            />
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-white">
          <h2 className="text-lg font-medium mb-4">System Status</h2>
          <div className="space-y-2">
            <StatusItem
              name="Student Information System"
              status="operational"
            />
            <StatusItem
              name="Learning Management System"
              status="operational"
            />
            <StatusItem name="Grade Reporting Portal" status="operational" />
            <StatusItem name="Attendance Tracking" status="operational" />
            <StatusItem
              name="Parent Portal"
              status="issue"
              details="Slow response"
            />
            <StatusItem name="Library System" status="operational" />
            <StatusItem name="Email Services" status="operational" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-6 bg-white">
          <h2 className="text-lg font-medium mb-4">Recent Notifications</h2>
          <div className="space-y-3">
            <NotificationItem
              title="New Student Registration"
              time="2 hours ago"
              description="15 new student registrations for the next academic year"
              priority="medium"
            />
            <NotificationItem
              title="System Update Scheduled"
              time="5 hours ago"
              description="Maintenance window planned for Saturday, April 5th at 10:00 PM"
              priority="high"
            />
            <NotificationItem
              title="Report Cards Generated"
              time="Yesterday"
              description="Third quarter report cards are ready for review"
              priority="medium"
            />
            <NotificationItem
              title="Staff Meeting Minutes"
              time="2 days ago"
              description="Minutes from the faculty meeting are now available"
              priority="low"
            />
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-white">
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <ActionButton icon="📊" label="Generate Reports" />
            <ActionButton icon="👥" label="Manage Users" />
            <ActionButton icon="📝" label="Create Announcement" />
            <ActionButton icon="📅" label="Schedule Event" />
            <ActionButton icon="📚" label="Course Management" />
            <ActionButton icon="⚙️" label="System Settings" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Supporting components
const DashboardCard = ({
  title,
  value,
  description,
  trend,
  percentage,
}: {
  title: string;
  value: string;
  description: string;
  trend: "up" | "down";
  percentage: string;
}) => {
  return (
    <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <div className="flex items-center mt-1">
        <span className="text-xs text-gray-500">{description}</span>
        <div
          className={`ml-auto text-xs font-medium ${trend === "up" ? "text-green-500" : "text-red-500"}`}
        >
          {trend === "up" ? "↑" : "↓"} {percentage}%
        </div>
      </div>
    </div>
  );
};

const StatusItem = ({
  name,
  status,
  details,
}: {
  name: string;
  status: "operational" | "issue" | "down";
  details?: string;
}) => {
  const statusColors = {
    operational: "bg-green-500",
    issue: "bg-yellow-500",
    down: "bg-red-500",
  };

  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <div className="flex items-center">
        <div
          className={`w-2 h-2 rounded-full ${statusColors[status]} mr-2`}
        ></div>
        <span className="text-sm">{name}</span>
      </div>
      <div className="flex items-center">
        {details && (
          <span className="text-xs text-gray-500 mr-2">{details}</span>
        )}
        <span className="text-xs font-medium">
          {status === "operational"
            ? "Operational"
            : status === "issue"
              ? "Minor Issue"
              : "Down"}
        </span>
      </div>
    </div>
  );
};

const EventItem = ({
  title,
  date,
  description,
  type,
}: {
  title: string;
  date: string;
  description: string;
  type: "academic" | "meeting" | "training" | "event";
}) => {
  const typeColors = {
    academic: "bg-blue-100 text-blue-800",
    meeting: "bg-purple-100 text-purple-800",
    training: "bg-amber-100 text-amber-800",
    event: "bg-green-100 text-green-800",
  };

  return (
    <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors">
      <div className="flex-none pt-0.5">
        <span className="text-xl">
          {type === "academic"
            ? "📚"
            : type === "meeting"
              ? "👥"
              : type === "training"
                ? "🎓"
                : "🎉"}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{date}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <div className="flex-none">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[type]}`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </div>
    </div>
  );
};

const NotificationItem = ({
  title,
  time,
  description,
  priority,
}: {
  title: string;
  time: string;
  description: string;
  priority: "low" | "medium" | "high";
}) => {
  const priorityColors = {
    low: "bg-gray-100",
    medium: "bg-blue-100",
    high: "bg-red-100",
  };

  return (
    <div className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
      <div
        className={`w-2 h-2 mt-2 rounded-full ${
          priority === "low"
            ? "bg-gray-400"
            : priority === "medium"
              ? "bg-blue-500"
              : "bg-red-500"
        }`}
      ></div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label }: { icon: string; label: string }) => {
  return (
    <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <span className="text-2xl mb-2">{icon}</span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
};

export default SystemAdminPage;
