import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, BookOpen, Target, Users, Clock, ListChecks } from "lucide-react";

export interface CourseDetailedData {
  learning_objectives: string;
  prerequisites: string;
  curriculum: string;
  duration: string;
  target_audience: string;
}

const EMPTY_DATA: CourseDetailedData = {
  learning_objectives: "",
  prerequisites: "",
  curriculum: "",
  duration: "",
  target_audience: "",
};

interface Props {
  value: CourseDetailedData;
  onChange: (data: CourseDetailedData) => void;
}

const sections = [
  {
    key: "learning_objectives" as const,
    label: "What You'll Learn",
    icon: Target,
    placeholder: "List key learning outcomes, one per line.\ne.g.\n• Master technical analysis fundamentals\n• Build risk management frameworks\n• Understand portfolio construction",
    rows: 4,
  },
  {
    key: "curriculum" as const,
    label: "Curriculum / Modules",
    icon: ListChecks,
    placeholder: "Outline your course modules or agenda.\ne.g.\nModule 1: Introduction to Markets\nModule 2: Technical Analysis\nModule 3: Risk Management",
    rows: 5,
  },
  {
    key: "prerequisites" as const,
    label: "Prerequisites",
    icon: BookOpen,
    placeholder: "What should learners know before starting?\ne.g. Basic understanding of financial markets",
    rows: 2,
  },
  {
    key: "target_audience" as const,
    label: "Who This Is For",
    icon: Users,
    placeholder: "Describe your ideal learner.\ne.g. Beginner to intermediate investors looking to improve their analysis skills",
    rows: 2,
  },
  {
    key: "duration" as const,
    label: "Duration & Schedule",
    icon: Clock,
    placeholder: "e.g. 6 weeks, 2 hours per week | Self-paced",
    rows: 1,
  },
];

export function serializeDetailedContent(data: CourseDetailedData): string | null {
  const hasContent = Object.values(data).some((v) => v.trim());
  if (!hasContent) return null;
  return JSON.stringify(data);
}

export function parseDetailedContent(raw: string | null): CourseDetailedData {
  if (!raw) return { ...EMPTY_DATA };
  try {
    const parsed = JSON.parse(raw);
    return { ...EMPTY_DATA, ...parsed };
  } catch {
    // Legacy plain text — put it all in curriculum
    return { ...EMPTY_DATA, curriculum: raw };
  }
}

const CourseDetailedForm = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const hasContent = Object.values(value).some((v) => v.trim());

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          type="button"
          className="w-full justify-between text-sm font-medium"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Detailed Content
            <span className="text-muted-foreground font-normal">(optional)</span>
            {hasContent && (
              <span className="h-2 w-2 rounded-full bg-primary" />
            )}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="mt-3 border-dashed">
          <CardContent className="p-4 space-y-4">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.key} className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 text-sm">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    {section.label}
                  </Label>
                  {section.rows === 1 ? (
                    <Input
                      placeholder={section.placeholder}
                      value={value[section.key]}
                      onChange={(e) =>
                        onChange({ ...value, [section.key]: e.target.value })
                      }
                    />
                  ) : (
                    <Textarea
                      placeholder={section.placeholder}
                      value={value[section.key]}
                      onChange={(e) =>
                        onChange({ ...value, [section.key]: e.target.value })
                      }
                      rows={section.rows}
                    />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CourseDetailedForm;
export { EMPTY_DATA };
