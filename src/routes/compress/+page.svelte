<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { File as FileIcon } from 'lucide-svelte';
	import Compressor from 'compressorjs';
	import { Input } from '$lib/components/ui/input/index.js';

	let file1: FileList | null = $state(null);
	let compressedFiles: { url: string; name: string }[] = $state([]);
	let isDragging: boolean = $state(false);

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		file1 = target.files;
	}

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
		document.getElementById('file')?.click();
	}

	function getCompressedName(file: File) {
		const parts = file.name.split('.');
		const ext = parts.pop();
		const base = parts.join('.');
		return `${base}.compressed.${ext}`;
	}

	function compressImages() {
		if (!file1) return;

		compressedFiles = [];

		Array.from(file1).forEach((file) => {
			new Compressor(file, {
				quality: 0.8,
				success(result) {
					const url = URL.createObjectURL(result as Blob);
					const name = getCompressedName(file);

					compressedFiles = [...compressedFiles, { url, name }];
				},
				error(err) {
					console.error(err);
				}
			});
		});
	}
</script>

<div class="flex min-h-screen items-center justify-center">
	<Card.Root class="mx-auto w-full max-w-[66vw]">
		<Card.Header>
			<Card.Title>Kompresi Gambar</Card.Title>
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
							<Empty.Title>Gambar Belum Di Upload</Empty.Title>
						</Empty.Header>

						<Empty.Content>
							<p>Drag & Drop atau klik untuk upload</p>
							<Input
								id="file"
								type="file"
								accept="image/*"
								multiple
								class="hidden"
								onchange={handleChange}
							/>
							<Button type="button">Upload</Button>
						</Empty.Content>
					</Empty.Root>
				</div>
			{:else}
				<div class="grid grid-cols-2 gap-3">
					{#each Array.from(file1) as file}
						<img src={URL.createObjectURL(file)} class="rounded-xl" alt={file.name} />
					{/each}
				</div>
			{/if}

			{#if file1 && file1.length > 0}
				<div class="mt-4 space-y-3">
					<Button onclick={compressImages}>Compress</Button>
				</div>
			{/if}
		</Card.Content>

		<Card.Footer>
			{#if compressedFiles.length > 0}
				<div class="mt-4 space-y-3">
					<p>Hasil Kompresi:</p>
					<div class="grid grid-cols-2 gap-3">
						{#each compressedFiles as img}
							<div>
								<img src={img.url} class="mb-2 rounded-xl" alt={img.name} />
								<a href={img.url} download={img.name}>
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
