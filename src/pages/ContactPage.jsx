import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContactPage = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <section className="py-32 px-8 bg-gradient-hero min-h-[60vh]">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl font-extrabold text-white mb-8 text-center">
            Contact Us
          </h1>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-gray-300">
            <p className="mb-6 text-lg">
              Have questions? We'd love to hear from you!
            </p>
            <div className="mb-4">
              <strong className="text-white">Email:</strong>{" "}
              support@financeai.com
            </div>
            <div className="mb-4">
              <strong className="text-white">Phone:</strong> +1 (555) 123-4567
            </div>
            <div className="mb-4">
              <strong className="text-white">Address:</strong> 123 Finance
              Street, Tech City, TC 12345
            </div>
            <div className="mt-8">
              <strong className="text-white">Business Hours:</strong>
              <br />
              Monday - Friday: 9:00 AM - 6:00 PM EST
              <br />
              Saturday: 10:00 AM - 4:00 PM EST
              <br />
              Sunday: Closed
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactPage;
