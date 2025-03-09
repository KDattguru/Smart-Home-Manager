import { Card, Group, RingProgress, Text, useMantineTheme } from "@mantine/core";
import "../styles/Home.css";

const stats = [
  { value: 447, label: "Remaining" },
  { value: 76, label: "In progress" },
];

export function StatsRingCard() {
  const theme = useMantineTheme();
  const completed = 1887;
  const total = 2334;
  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text className="label">{stat.value}</Text>
      <Text size="xs" color="dimmed">
        {stat.label}
      </Text>
    </div>
  ));

  return (
    <Card variant="outline" padding="xl" radius="md" className="card">
      <div className="inner">
        <div>
          <Text size="xl" className="label">
           Home Maintaince Statc
          </Text>
          <div>
            <Text className="lead" mt={30}>
              1887
            </Text>
            <Text size="xs" color="dimmed">
              Completed
            </Text>
          </div>
          <Group mt="lg">{items}</Group>
        </div>

        <div className="ring">
          <RingProgress
            roundCaps
            thickness={6}
            size={150}
            sections={[{ value: (completed / total) * 100, color: theme.primaryColor }]}
            label={
              <div>
                <Text align="center" size="lg" className="label">
                  {((completed / total) * 100).toFixed(0)}%
                </Text>
                <Text align="center" size="xs" color="dimmed">
                  Completed
                </Text>
              </div>
            }
          />
        </div>
      </div>
    </Card>
  );
}

export default StatsRingCard;
