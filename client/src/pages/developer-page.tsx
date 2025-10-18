import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Code, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import satbirImage from "@/images/Satbir Singh.png";
import manviImage from "@/images/Manvi.png";
import brahamjotImage from "@/images/bRAHAMJOT.jpg";

export default function DeveloperPage() {
  const developers = [
    {
      name: "Satbir Singh",
      education: "B.Tech student in Information Technology of 2022-26 batch",
      linkedin: "https://www.linkedin.com/in/satbir-singh-486587254",
      email: "satbirsinghubhi@gmail.com",
      image: satbirImage,
    },
    {
      name: "Manvi",
      education: "B.Tech student in Information Technology of 2022-26 batch",
      linkedin: "#",
      email: "manvi@example.com",
      image: manviImage,
    },
    {
      name: "Brahamjot",
      education: "B.Tech student in Information Technology of 2022-26 batch",
      linkedin: "#",
      email: "brahamjot@example.com",
      image: brahamjotImage,
    },
  ];

  return (
    <div className="space-y-8">
      {" "}
      {/* Header Section */}{" "}
      <header>
        {" "}
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          {" "}
          <Code className="h-7 w-7 text-primary" /> Developers{" "}
        </h1>{" "}
        <p className="text-muted-foreground mt-2 max-w-2xl">
          {" "}
          Meet the talented team behind this Cybersecurity Toolkit{" "}
        </p>{" "}
      </header>{" "}
      {/* Developer Cards Grid */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {" "}
        {developers.map((dev, index) => (
          <Card
            key={index}
            className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            {" "}
            <CardHeader className="pb-4">
              {" "}
              {/* Developer Image */}{" "}
              <div className="flex justify-center mb-4">
                {" "}
                <img
                  src={dev.image}
                  alt={dev.name}
                  className="w-32 h-32 rounded-full object-cover border-2 border-border shadow-md"
                />{" "}
              </div>
              {/* Name */}
              <div className="text-center">
                <h3 className="text-xl font-semibold">{dev.name}</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Education */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Education</p>
                <p className="text-sm font-medium">{dev.education}</p>
              </div>

              {/* Contact Links */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 flex-1"
                  asChild>
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 flex-1"
                  asChild>
                  <a href={`mailto:${dev.email}`}>
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Team Description */}
      <Card className="bg-muted/50">
        <CardHeader>
          <h2 className="text-lg font-semibold">About the Team</h2>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Our team of passionate B.Tech students from the Information
            Technology department (2022-26 batch) have come together to build
            this comprehensive Cybersecurity Toolkit. With expertise spanning
            across full-stack development, security analysis, and modern web
            technologies, we're dedicated to creating tools that help identify
            and prevent cybersecurity threats.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
