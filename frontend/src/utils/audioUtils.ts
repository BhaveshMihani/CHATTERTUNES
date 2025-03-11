export const getAudioDuration = (file: File): Promise<number> => {
	return new Promise((resolve, reject) => {
		const audio = document.createElement("audio");
		audio.src = URL.createObjectURL(file);
		audio.addEventListener("loadedmetadata", () => {
			resolve(audio.duration);
		});
		audio.addEventListener("error", (e) => {
			reject(e);
		});
	});
};
