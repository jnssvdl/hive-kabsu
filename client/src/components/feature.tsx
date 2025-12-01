import type { IconType } from "react-icons/lib";

type FeatureProps = {
  Icon: IconType;
  title: string;
  description: string;
};

export default function Feature({ Icon, title, description }: FeatureProps) {
  return (
    <div className="group bg-card/40 flex h-full flex-col rounded-lg border p-6 shadow-sm transition-transform duration-300 ease-in-out hover:-translate-y-1.5">
      <h3 className="mb-4 text-center text-xl font-semibold text-balance transition-transform duration-300 ease-in-out group-hover:-translate-y-1">
        <Icon className="mx-auto mb-4 text-3xl text-balance transition-transform duration-300 ease-in-out group-hover:-translate-y-1" />
        {title}
      </h3>
      <p className="text-muted-foreground text-center transition-transform duration-300 ease-in-out group-hover:-translate-y-1">
        {description}
      </p>
    </div>
  );
}
