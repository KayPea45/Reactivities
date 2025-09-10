import { CloudUpload } from "@mui/icons-material";
import { Box, Button, Grid2, keyframes, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

type Props = {
	uploadPhoto: (file: Blob) => void;
	loading: boolean;
};

export default function PhotoUpload({ uploadPhoto, loading }: Props) {
	// Why array of files?
	// Because in most upload components, the files variable in the Html <input type="file" /> supports selecting multiple files. the files always return a FileList object, which is an array-like object - even if we only select one file.
	// in our scenario, we only access the first file, so we can use an array of objects with a preview property to store the file and its preview URL.
	const [files, setFiles] = useState<object & { preview: string }[]>([]);
	const cropperRef = useRef<ReactCropperElement>(null);

	useEffect(() => {
		// Make sure to revoke the data uris to avoid memory leaks
		// NOTE: the return function in useEffect runs when the component unmounts or when the dependencies change (in this case, when files changes)
		return () => {
			// runs when the component unmounts or when files changes
			files.forEach((file) => URL.revokeObjectURL(file.preview));
		};
	}, [files]);

	const pulse = keyframes`
	0% { transform: scale(1); }
	50% { transform: scale(1.01); }
	100% { transform: scale(1); }
	`;

	const onDrop = useCallback((acceptedFiles: File[]) => {
		setFiles(
			acceptedFiles.map((file) =>
				Object.assign(file, {
					preview: URL.createObjectURL(file as Blob),
				})
			)
		);
		console.log(acceptedFiles);
	}, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
	});

	// we use useCallback to memoize the onCrop function
	// the dependency array we will pass the uploadPhoto function so that whenever the uploadPhoto function changes, the onCrop function will be recreated
	const onCrop = useCallback(() => {
		const cropper = cropperRef.current?.cropper;
		cropper?.getCroppedCanvas().toBlob((blob) => {
			uploadPhoto(blob as Blob);
		});
	}, [uploadPhoto]);

	return (
		<Grid2 container sx={{ marginTop: 1, marginLeft: 1 }} spacing={4}>
			<Grid2 size={4}>
				<Typography fontSize={14} variant="overline" color="#20a7ac">
					Step 1 - Add photo
				</Typography>
				<Box
					{...getRootProps()}
					sx={{
						border: "dashed 3px #eee",
						borderColor: isDragActive ? "#20a7ac" : "#eee",
						borderRadius: "5px",
						height: "280px",
						cursor: "pointer",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: isDragActive ? "#f0f8ff" : "transparent",
						"&:hover": {
							backgroundColor: "#d6e5f238",
							animation: `${pulse} 1s infinite alternate`,
						},
					}}
				>
					<input {...getInputProps()} />
					<CloudUpload sx={{ fontSize: 80 }} />
					<Typography variant="h5">Upload image</Typography>
				</Box>
			</Grid2>
			<Grid2 size={4}>
				<Typography fontSize={14} variant="overline" color="#20a7ac">
					Step 2 - Resize photo
				</Typography>
				{files[0]?.preview && (
					<Cropper
						ref={cropperRef}
						src={files[0]?.preview}
						style={{ height: 300, width: "90%" }}
						initialAspectRatio={1}
						aspectRatio={1}
						preview=".img-preview"
						guides={true}
						viewMode={1}
						background={false}
					/>
				)}
			</Grid2>
			<Grid2 size={4}>
				<Typography fontSize={14} variant="overline" color="#20a7ac">
					Step 3 - Preview & Upload
				</Typography>
				{files[0]?.preview && (
					<>
						<div
							className="img-preview"
							style={{ width: 300, height: 300, overflow: "hidden" }}
						/>
						<Button
							sx={{ mt: 2, width: 300 }}
							onClick={onCrop}
							color="success"
							disabled={loading}
							variant="contained"
						>
							Upload
						</Button>
					</>
				)}
			</Grid2>
		</Grid2>
	);
}
