
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, ClipboardCheck, UserCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <nav className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-700">MedSchedule</h1>
          <Link to="/login">
            <Button variant="outline" className="font-medium">
              Doctor Login
            </Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center animate-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Streamlined Medical Appointment Management
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Efficient scheduling, seamless record management, and enhanced patient care
            in one integrated platform.
          </p>
          <Link to="/login">
            <Button size="lg" className="font-semibold text-lg px-8">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-6 rounded-2xl shadow-sm card-hover">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
            <p className="text-gray-600">
              Manage your appointments efficiently with our intuitive calendar interface.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm card-hover">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <ClipboardCheck className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Medical Records</h3>
            <p className="text-gray-600">
              Securely manage and access patient records with easy form filling and PDF
              downloads.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm card-hover">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <UserCircle className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Doctor Profiles</h3>
            <p className="text-gray-600">
              Maintain your professional profile and manage your practice efficiently.
            </p>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-8 border-t">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 MedSchedule. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
