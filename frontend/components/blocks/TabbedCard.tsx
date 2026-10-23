import { FC, ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WidgetCard from "@/components/analytics/WidgetCard";

export interface TabbedCardTab {
  value: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

const TabbedCard: FC<{
  tabs: TabbedCardTab[];
  defaultValue?: string;
  className?: string;
}> = ({ tabs, defaultValue, className }) => (
  <WidgetCard className={className}>
    <Tabs defaultValue={defaultValue ?? tabs[0]?.value}>
      <TabsList className='bg-zinc-100 dark:bg-zinc-800/60'>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className='gap-2'>
            {tab.icon}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className='mt-4'>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  </WidgetCard>
);

export default TabbedCard;
