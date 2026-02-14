import { parseDetailedContent } from "./CourseDetailedForm";
import { Separator } from "@/components/ui/separator";
import { Target, ListChecks, BookOpen, Users, Clock, CheckCircle2 } from "lucide-react";

interface Props {
  detailedContent: string | null;
}

const CourseDetailedDisplay = ({ detailedContent }: Props) => {
  if (!detailedContent) return null;

  const data = parseDetailedContent(detailedContent);
  const hasAny = Object.values(data).some((v) => v.trim());
  if (!hasAny) return null;

  const renderBulletList = (text: string) => {
    const lines = text
      .split("\n")
      .map((l) => l.replace(/^[•\-*]\s*/, "").trim())
      .filter(Boolean);
    return (
      <ul className="space-y-2">
        {lines.map((line, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
            <span className="text-sm text-foreground">{line}</span>
          </li>
        ))}
      </ul>
    );
  };

  const renderText = (text: string) => (
    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
      {text}
    </p>
  );

  const sections = [
    {
      key: "learning_objectives",
      label: "What You'll Learn",
      icon: Target,
      render: renderBulletList,
      value: data.learning_objectives,
    },
    {
      key: "curriculum",
      label: "Curriculum",
      icon: ListChecks,
      render: renderText,
      value: data.curriculum,
    },
    {
      key: "prerequisites",
      label: "Prerequisites",
      icon: BookOpen,
      render: renderText,
      value: data.prerequisites,
    },
    {
      key: "target_audience",
      label: "Who This Is For",
      icon: Users,
      render: renderText,
      value: data.target_audience,
    },
    {
      key: "duration",
      label: "Duration & Schedule",
      icon: Clock,
      render: renderText,
      value: data.duration,
    },
  ];

  const activeSections = sections.filter((s) => s.value.trim());

  return (
    <>
      {activeSections.map((section) => {
        const Icon = section.icon;
        return (
          <div key={section.key}>
            <Separator className="mb-6" />
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                {section.label}
              </h2>
              {section.render(section.value)}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CourseDetailedDisplay;
