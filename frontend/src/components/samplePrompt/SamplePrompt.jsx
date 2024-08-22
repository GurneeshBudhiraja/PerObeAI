import CheckroomIcon from '@mui/icons-material/Checkroom';
import IronOutlinedIcon from '@mui/icons-material/IronOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import FilterVintageRoundedIcon from '@mui/icons-material/FilterVintageRounded';

// SamplePrompt component for displaying sample prompts
function SamplePrompt({ samplePrompt, onClick,index, className = ""}) {
  return (
    <div
    onClick={onClick}
    className={`${className} p-3 rounded w-36 h-36 text-sm lg:text-base lg:w-44 lg:h-40 cursor-pointer  hover:scale-105 md:hover:-translate-y-3 hover:shadow-3xl transition-all duration-200 ease-linear text-start relative`}
    >
      {samplePrompt}
      {index === 0 && <CheckroomIcon className="absolute bottom-4 right-4" />}      
      {index === 1 && <IronOutlinedIcon className="absolute bottom-4 right-4" />}      
      {index === 2 && <SellOutlinedIcon className="absolute bottom-4 right-4" />}      
      {index === 3 && <FilterVintageRoundedIcon className="absolute bottom-4 right-4" />}      
    </div>
  );
}

export default SamplePrompt;
