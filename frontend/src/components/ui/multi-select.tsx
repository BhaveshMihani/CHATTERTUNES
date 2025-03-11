import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface MultiSelectProps {
	options: string[];
	selected: string[];
	onChange: (selected: string[]) => void;
}

export const MultiSelect = ({ options, selected, onChange }: MultiSelectProps) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const toggleOption = (option: string) => {
		if (selected.includes(option)) {
			onChange(selected.filter((item) => item !== option));
		} else {
			onChange([...selected, option]);
		}
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setDropdownOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="relative" ref={dropdownRef}>
			<div
				className="border border-zinc-700 bg-zinc-800 p-2 rounded cursor-pointer"
				onClick={() => setDropdownOpen(!dropdownOpen)}
			>
				{selected.length > 0 ? (
					<div className="flex flex-wrap gap-2">
						{selected.map((tag) => (
							<div key={tag} className="flex items-center bg-slate-950 text-white px-2 py-1 rounded">
								{tag}
								<X className="ml-1 cursor-pointer" onClick={() => toggleOption(tag)} />
							</div>
						))}
					</div>
				) : (
					<span className="text-zinc-400">Select Genres</span>
				)}
			</div>
			{dropdownOpen && (
				<div className="absolute mt-1 w-full border border-zinc-700 bg-zinc-800 rounded shadow-lg z-10">
					{options.map((option) => (
						<div
							key={option}
							className={`p-2 cursor-pointer ${selected.includes(option) ? "bg-slate-900 text-white" : "text-zinc-400"}`}
							onClick={() => toggleOption(option)}
						>
							{option}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
