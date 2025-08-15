function TextureViewer() {
    const noiseLayers = [1, 4, 5, 6]
    return (
        <div className="size-full flex flex-wrap justify-center gap-4 box-border p-4">
            {noiseLayers.map((item) =>
                <div
                    key={item}
                    className="aspect-quare min-w-[calc(33%-1rem)] w-1fr rounded-xl bg-black">
                </div >
            )}
        </div >
    )
}

export default TextureViewer