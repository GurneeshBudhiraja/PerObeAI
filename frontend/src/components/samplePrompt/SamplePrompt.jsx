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
      className={`${className} p-3 rounded w-36 h-36 text-sm lg:text-base lg:w-44 lg:h-40 ${
        loading ? "cursor-not-allowed " : "cursor-pointer"
      }  hover:scale-105 md:hover:-translate-y-3 hover:shadow-3xl transition-all duration-200 ease-linear text-start relative`}
    >
      {samplePrompt}
      {IconComponent && (
        <IconComponent className="absolute bottom-2 right-2 text-4xl lg:text-5xl" />
      )}
    </div>
  );
}

export default SamplePrompt;
