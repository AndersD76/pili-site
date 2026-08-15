import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        poster?: string;
        alt?: string;
        "auto-rotate"?: string;
        "auto-rotate-delay"?: string;
        "rotation-per-second"?: string;
        "camera-controls"?: string;
        "camera-orbit"?: string;
        "min-field-of-view"?: string;
        "interaction-prompt"?: string;
        "shadow-intensity"?: string;
        "shadow-softness"?: string;
        exposure?: string;
        "environment-image"?: string;
        ar?: string;
        "ar-modes"?: string;
        "ar-scale"?: string;
        "ar-placement"?: string;
        "ios-src"?: string;
        loading?: string;
        reveal?: string;
      };
    }
  }
}
