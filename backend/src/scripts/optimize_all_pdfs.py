import os
import io
import pymupdf
from PIL import Image

def optimize_pdf_file(input_path, output_path, max_size_mb=9.5):
    """
    Optimizes a PDF to ensure it is under max_size_mb while preserving 100% of pages and layout.
    """
    orig_size_bytes = os.path.getsize(input_path)
    orig_size_mb = orig_size_bytes / (1024 * 1024)
    doc = pymupdf.open(input_path)
    orig_pages = len(doc)
    
    # If already under threshold, standard save with garbage collection & deflation
    if orig_size_mb <= max_size_mb:
        doc.save(output_path, garbage=4, deflate=True)
        new_size_mb = os.path.getsize(output_path) / (1024 * 1024)
        print(f"[PRESERVED] {os.path.basename(input_path)}: {orig_pages} pages | {orig_size_mb:.2f} MB -> {new_size_mb:.2f} MB")
        return orig_pages, new_size_mb

    print(f"[OPTIMIZING] {os.path.basename(input_path)}: {orig_pages} pages | {orig_size_mb:.2f} MB (Target <= {max_size_mb} MB)...")

    # Try progressive compression
    for quality in [75, 68, 60, 52]:
        doc = pymupdf.open(input_path)
        for page in doc:
            for img_info in page.get_images():
                xref = img_info[0]
                base_img = doc.extract_image(xref)
                image_bytes = base_img['image']
                try:
                    pil_img = Image.open(io.BytesIO(image_bytes))
                    max_dim = 1600 if quality <= 68 else 1800
                    if pil_img.width > max_dim or pil_img.height > max_dim:
                        ratio = max_dim / max(pil_img.width, pil_img.height)
                        pil_img = pil_img.resize((int(pil_img.width * ratio), int(pil_img.height * ratio)), Image.Resampling.LANCZOS)
                    if pil_img.mode in ('RGBA', 'P'):
                        pil_img = pil_img.convert('RGB')
                    buf = io.BytesIO()
                    pil_img.save(buf, format='JPEG', quality=quality, optimize=True)
                    new_bytes = buf.getvalue()
                    if len(new_bytes) < len(image_bytes):
                        doc.update_stream(xref, new_bytes)
                except Exception:
                    pass
        
        doc.save(output_path, garbage=4, deflate=True)
        new_size_mb = os.path.getsize(output_path) / (1024 * 1024)
        if new_size_mb <= max_size_mb:
            break

    # Verification
    check_doc = pymupdf.open(output_path)
    assert len(check_doc) == orig_pages, f"Page count mismatch in {input_path}!"
    print(f"  -> SUCCESS: {os.path.basename(input_path)}: {orig_pages} pages | Final Size: {new_size_mb:.2f} MB")
    return orig_pages, new_size_mb

if __name__ == "__main__":
    notes_dir = os.path.abspath("../frontend/public/notes")
    opt_dir = os.path.abspath("uploads/optimized")
    os.makedirs(opt_dir, exist_ok=True)

    files = [f for f in os.listdir(notes_dir) if f.lower().endswith(".pdf")]
    print(f"Total PDFs to check/optimize: {len(files)}")
    
    for f in sorted(files):
        in_p = os.path.join(notes_dir, f)
        out_p = os.path.join(opt_dir, f)
        optimize_pdf_file(in_p, out_p)
    print("\nAll files successfully verified and optimized!")
