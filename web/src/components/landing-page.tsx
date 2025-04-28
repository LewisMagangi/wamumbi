import Footer from "@/components/footer"
import ImageSlider from "@/components/image-slider"
import MaxWidthWrapper from "@/components/max-width-wrapper"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  Facebook,
  HeartIcon,
  HomeIcon,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Users2Icon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const perks = [
  {
    name: "Safe Housing",
    Icon: HomeIcon,
    description:
      "We ensure orphaned children have access to safe and stable housing, either through supporting existing guardians or finding suitable foster homes.",
  },
  {
    name: "Education Support",
    Icon: Users2Icon,
    description:
      "We provide educational materials, school fees, uniforms, and mentorship to ensure children can attend school and build a better future.",
  },
  {
    name: "Healthcare Access",
    Icon: HeartIcon,
    description:
      "We facilitate access to healthcare services, including regular check-ups, vaccinations, and treatment for illnesses.",
  },
]

export default function Home() {
  return (
    <MaxWidthWrapper className="flex flex-col">
      <div className="flex-grow flex-1">
        <MaxWidthWrapper>
          <div className="grid grid-cols-1 gap-y-1 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-2 lg:gap-x-12">
            <div className="my-16 py-6 flex flex-col items-start justify-center">
              <h1 className="text-6xl font-bold tracking-tight text-rose-900 md:text-5xl lg:text-5xl">
                Bringing Hope to Orphaned Children.
              </h1>
              <p className="mt-8 text-xl sm:mr-5 font-medium text-gray-900">
                Wamumbi Charity Foundation is dedicated to improving the lives
                of orphaned children and supporting their guardians through
                community-based initiatives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  className={cn(
                    buttonVariants({
                      size: "lg",
                    }),
                    "text-base font-medium bg-rose-500 hover:bg-rose-600 text-white"
                  )}
                  href="#"
                >
                  Donate now
                </Link>
                <Link
                  className={cn(
                    buttonVariants({
                      size: "lg",
                      variant: "ghost",
                    }),
                    "text-base font-medium"
                  )}
                  href="#"
                >
                  Learn more <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </div>
            </div>

            <div className="sm:my-5 md:my-16 g:py-16 flex flex-col w-full">
              <ImageSlider />
            </div>
          </div>
        </MaxWidthWrapper>

        {/* value proposition section */}
        <div>
          <div className="relative isolate">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-30 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
              <div
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              />
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-30 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
              <div
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
                className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
              />
            </div>
          </div>
        </div>

        {/* Our services */}
        <MaxWidthWrapper>
          <div className="pt-5 pb-20 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-2 lg:gap-x-14 lg:gap-y-0">
            <div className="size-full flex flex-col items-center justify-center">
              <div className="relative bg-zinc-100 aspect-video overflow-hidden rounded-xl">
                <Image
                  src="/hero.png"
                  alt="Wamumbi Charity Foundation"
                  width={1536}
                  height={1024}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="sm:mr-5 lg:mr-5 flex flex-col items-start">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                About Wamumbi Charity Foundation
              </h2>
              <p className="mt-5 text-base text-gray-900">
                Wamumbi Charity Foundation is a non-profit community-based
                organization founded with a mission to reach out to orphaned
                children and their guardians, providing them with the support
                they need to thrive.
              </p>
              <p className="mt-4 text-base text-gray-900">
                Our foundation works directly within communities to identify
                vulnerable children and families, offering holistic support
                through education, healthcare, nutrition, and emotional
                well-being programs.
              </p>
              <p className="mt-4 text-base text-gray-900">
                We believe that every child deserves love, care, and the
                opportunity to reach their full potential, regardless of their
                circumstances.
              </p>
            </div>
          </div>
        </MaxWidthWrapper>

        <section className="border-t border-gray-200 bg-gray-50">
          <div className="py-20 px-12">
            <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-0">
              {perks.map((perk) => (
                <div
                  key={perk.name}
                  className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
                >
                  <div className="md:flex-shrink-0 flex justify-center">
                    <div className="h-16 w-16 flex items-center justify-center rounded-full bg-green-100 text-rose-900">
                      {<perk.Icon className="w-1/3 h-1/3" />}
                    </div>
                  </div>
                  <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                    <h3 className="text-base font-medium text-gray-900">
                      {perk.name}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {perk.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="py-16 md:py-24 bg-rose-600 text-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Our Impact
              </h2>
              <p className="max-w-2xl mx-auto opacity-90">
                Through the generous support of our donors and volunteers,
                we&apos;ve been able to make a significant difference in the
                lives of many children.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-5xl font-bold mb-2">500+</p>
                <p className="text-xl">Children Supported</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold mb-2">200+</p>
                <p className="text-xl">Families Assisted</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold mb-2">50+</p>
                <p className="text-xl">Community Programs</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold mb-2">15+</p>
                <p className="text-xl">Years of Service</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24 bg-white px-12">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Testimonials
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hear from the children, guardians, and community members whose
                lives have been touched by our work.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 italic mb-4">
                  &quot;The Wamumbi Foundation has been a blessing to our
                  family. After losing my parents, I didn&apos;t think I would
                  be able to continue my education. Now I&apos;m in my final
                  year of high school with plans for university.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">Sarah N.</p>
                    <p className="text-sm text-gray-500">
                      Student, 18 years old
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 italic mb-4">
                  &quot;As a guardian to my three orphaned grandchildren, I was
                  struggling to provide for their needs. The foundation&apos;s
                  support with food, education, and healthcare has lifted a huge
                  burden from my shoulders.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">Grace M.</p>
                    <p className="text-sm text-gray-500">Guardian</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 italic mb-4">
                  &quot;The community workshops organized by Wamumbi Foundation
                  have equipped me with skills to better support the orphaned
                  children in my care. Their holistic approach makes a real
                  difference.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">John K.</p>
                    <p className="text-sm text-gray-500">Community Leader</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-24 bg-white">
          <MaxWidthWrapper>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-6">
                  Contact Us
                </h2>
                <p className="text-gray-600 mb-8">
                  Have questions or want to learn more about our work? Get in
                  touch with us.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-rose-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">+254 123 456 789</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-rose-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">
                        info@wamumbifoundation.org
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-rose-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-gray-600">
                        123 Community Road, Nairobi, Kenya
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex space-x-4">
                  <a
                    href="#"
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Facebook className="h-5 w-5 text-gray-700" />
                  </a>
                  <a
                    href="#"
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Twitter className="h-5 w-5 text-gray-700" />
                  </a>
                  <a
                    href="#"
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Instagram className="h-5 w-5 text-gray-700" />
                  </a>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Send Us a Message</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                    ></textarea>
                  </div>
                  <Button className="bg-rose-600 hover:bg-rose-700 w-full">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </MaxWidthWrapper>
        </section>

        {/* Get Involved Section */}
        <section className="py-16 md:py-24 bg-gray-50 px-12">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Get Involved
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                There are many ways you can support our mission and make a
                difference in the lives of orphaned children.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold mb-3">Donate</h3>
                <p className="text-gray-600 mb-4">
                  Your financial contribution helps us provide essential
                  services to children and their guardians.
                </p>
                <Button className="bg-rose-600 hover:bg-rose-700 w-full">
                  Donate Now
                </Button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold mb-3">Volunteer</h3>
                <p className="text-gray-600 mb-4">
                  Share your time and skills to directly impact the lives of the
                  children we serve.
                </p>
                <Button variant="outline" className="w-full">
                  Join Our Team
                </Button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold mb-3">Partner With Us</h3>
                <p className="text-gray-600 mb-4">
                  Organizations and businesses can partner with us to create
                  sustainable impact.
                </p>
                <Button variant="outline" className="w-full">
                  Become a Partner
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </MaxWidthWrapper>
  )
}
