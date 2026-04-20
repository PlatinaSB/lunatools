<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { File as FileIcon, X as Xicon } from 'lucide-svelte';
	import Compressor from 'compressorjs';
	import { Input } from '$lib/components/ui/input/index.js';
	import { onDestroy } from 'svelte';

	let file1: FileList | undefined = $state(undefined);
	let compressedFiles: { url: string; name: string }[] = $state([]);
	let isDragging = $state(false);
	let fileInput: HTMLInputElement | null | undefined = $state(null);

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		if (e.dataTransfer?.files) {
			file1 = e.dataTransfer.files;
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function triggerFile() {
		fileInput?.click();
	}

	function getCompressedName(file: File) {
		const parts = file.name.split('.');
		const ext = parts.pop();
		const base = parts.join('.');
		return `${base}.compressed.${ext}`;
	}

	function removeFile(index: number) {
		if (!file1) return;

		const dt = new DataTransfer();
		Array.from(file1).forEach((file, i) => {
			if (i !== index) dt.items.add(file);
		});

		file1 = dt.files;
	}

	function clearFiles() {
		file1 = undefined;
		compressedFiles.forEach((f) => URL.revokeObjectURL(f.url));
		compressedFiles = [];
	}

	async function compressImages() {
		if (!file1) return;

		compressedFiles.forEach((f) => URL.revokeObjectURL(f.url));
		compressedFiles = [];

		const files = Array.from(file1);

		const results = await Promise.all(
			files.map(
				(file) =>
					new Promise<{ url: string; name: string }>((resolve, reject) => {
						new Compressor(file, {
							quality: 0.8,
							success(result) {
								resolve({
									url: URL.createObjectURL(result as Blob),
									name: getCompressedName(file)
								});
							},
							error(err) {
								reject(err);
							}
						});
					})
			)
		);

		compressedFiles = results;
	}

	onDestroy(() => {
		compressedFiles.forEach((f) => URL.revokeObjectURL(f.url));
	});
</script>

<div class="flex min-h-screen items-center justify-center">
	<Card.Root class="mx-auto w-full max-w-[66vw]">
		<Card.Header>
			<Card.Title>Compress Image</Card.Title>
		</Card.Header>

		<Card.Content>
			{#if !file1 || file1.length === 0}
				<div
					role="button"
					tabindex="0"
					class={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center ${
						isDragging ? 'border-blue-500 bg-blue-50' : ''
					}`}
					ondrop={handleDrop}
					ondragover={handleDragOver}
					ondragleave={handleDragLeave}
					onclick={triggerFile}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') triggerFile();
					}}
				>
					<Empty.Root>
						<Empty.Header>
							<Empty.Media variant="icon">
								<FileIcon />
							</Empty.Media>
							<Empty.Title>No Image Uploaded</Empty.Title>
						</Empty.Header>

						<Empty.Content>
							<p>Drag & Drop or click to upload</p>
							<Input
								id="file"
								type="file"
								accept="image/*"
								multiple
								class="hidden"
								bind:ref={fileInput}
								bind:files={file1}
							/>
							<Button onclick={triggerFile}>Upload</Button>
						</Empty.Content>
					</Empty.Root>
				</div>
			{:else}
				<div class="grid grid-cols-2 gap-3">
					{#each Array.from(file1) as file, i (file.name + i)}
						<div class="relative">
							<img src={URL.createObjectURL(file)} class="rounded-xl" alt={file.name} />
							<Button
								class="absolute top-1 right-1"
								variant="destructive"
								onclick={() => removeFile(i)}
							>
								<Xicon />
							</Button>
						</div>
					{/each}
				</div>
			{/if}

			{#if file1 && file1.length > 0}
				<div class="mt-4 space-y-3">
					<div class="flex items-center gap-3">
						<Button variant="destructive" onclick={clearFiles}>Clear All</Button>
					</div>
					<Button onclick={compressImages}>Compress</Button>
				</div>
			{/if}
		</Card.Content>

		<Card.Footer>
			{#if compressedFiles.length > 0}
				<div class="mt-4 space-y-3">
					<p>Hasil Kompresi:</p>
					<div class="grid grid-cols-2 gap-3">
						{#each compressedFiles as img (img.name)}
							<div>
								<img src={img.url} class="mb-2 rounded-xl" alt={img.name} />
								<a href={img.url} rel="" download={img.name}>
									<Button>Download</Button>
								</a>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</Card.Footer>
	</Card.Root>
</div>
