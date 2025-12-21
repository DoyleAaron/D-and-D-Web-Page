#!/usr/bin/env python3
"""
Lore Statistics Script
Analyzes the Lore/DND folder for word count, line count, file count, etc.
"""

import os
from pathlib import Path
from collections import defaultdict

LORE_PATH = Path(__file__).parent / "Lore" / "DND"

def count_file_stats(filepath):
    """Count words and lines in a file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            lines = content.count('\n') + 1
            words = len(content.split())
            chars = len(content)
            return {'lines': lines, 'words': words, 'chars': chars}
    except Exception as e:
        print(f"  Warning: Could not read {filepath}: {e}")
        return {'lines': 0, 'words': 0, 'chars': 0}

def get_category(filepath):
    """Extract the top-level category from a file path."""
    rel_path = filepath.relative_to(LORE_PATH)
    parts = rel_path.parts
    if len(parts) > 1:
        return parts[0]
    return "Root"

def main():
    if not LORE_PATH.exists():
        print(f"Error: Lore path not found: {LORE_PATH}")
        return
    
    # Collect stats
    total_files = 0
    total_words = 0
    total_lines = 0
    total_chars = 0
    
    category_stats = defaultdict(lambda: {'files': 0, 'words': 0, 'lines': 0})
    largest_files = []
    
    md_files = list(LORE_PATH.rglob("*.md"))
    
    for filepath in md_files:
        stats = count_file_stats(filepath)
        category = get_category(filepath)
        
        total_files += 1
        total_words += stats['words']
        total_lines += stats['lines']
        total_chars += stats['chars']
        
        category_stats[category]['files'] += 1
        category_stats[category]['words'] += stats['words']
        category_stats[category]['lines'] += stats['lines']
        
        largest_files.append((filepath.name, stats['words'], filepath))
    
    # Sort largest files
    largest_files.sort(key=lambda x: x[1], reverse=True)
    
    # Print results
    print("\n" + "="*60)
    print("📚 DAYNER LORE STATISTICS")
    print("="*60)
    
    print(f"\n📊 TOTALS")
    print(f"   Files:      {total_files:,}")
    print(f"   Words:      {total_words:,}")
    print(f"   Lines:      {total_lines:,}")
    print(f"   Characters: {total_chars:,}")
    
    # Estimate reading time (avg 200 words per minute)
    reading_mins = total_words / 200
    hours = int(reading_mins // 60)
    mins = int(reading_mins % 60)
    print(f"   Est. Read:  {hours}h {mins}m (at 200 wpm)")
    
    # Estimate pages (avg 300 words per page)
    pages = total_words / 300
    print(f"   Est. Pages: ~{int(pages)} pages")
    
    print(f"\n📁 BY CATEGORY")
    print("-"*50)
    sorted_cats = sorted(category_stats.items(), key=lambda x: x[1]['words'], reverse=True)
    for cat, stats in sorted_cats:
        print(f"   {cat:25} {stats['files']:4} files  {stats['words']:,} words")
    
    print(f"\n📄 TOP 10 LARGEST FILES")
    print("-"*50)
    for name, words, path in largest_files[:10]:
        print(f"   {name:35} {words:,} words")
    
    print("\n" + "="*60)
    print()

if __name__ == "__main__":
    main()
