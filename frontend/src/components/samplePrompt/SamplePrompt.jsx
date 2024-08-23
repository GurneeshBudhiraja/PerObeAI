import CheckroomIcon from "@mui/icons-material/Checkroom";
import IronOutlinedIcon from "@mui/icons-material/IronOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import FilterVintageRoundedIcon from "@mui/icons-material/FilterVintageRounded";

const icons = [
  CheckroomIcon,
  IronOutlinedIcon,
  SellOutlinedIcon,
  FilterVintageRoundedIcon,
];

// SamplePrompt component for displaying sample prompts
function SamplePrompt({
  samplePrompt,
  onClick,
  index,
  loading,
  className = "",
}) {
  const IconComponent = icons[index];
  return (
    <div
      onClick={!loading ? onClick : null}
      className={`${className} p-3 rounded w-36 h-36 text-sm lg:text-base lg:w-44 lg:h-40 select-none ${
        loading ? "cursor-not-allowed " : "cursor-pointer"
      }  hover:scale-[1.03] md:hover:-translate-y-2 md:active:-translate-y-1 md:active:scale-100 md:active:shadow-active-shadow hover:shadow-3xl transition-all duration-[250ms] ease-in-out text-start relative`}
    >
      {samplePrompt}
      {IconComponent && (
        <IconComponent className="absolute bottom-2 right-2 text-4xl lg:text-5xl" />
      )}
    </div>
  );
}

export default SamplePrompt;
