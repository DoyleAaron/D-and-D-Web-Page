"""
Cross-Reference Linking Script for D&D Lore Filess
Adds markdown hyperlinks between related entities (characters, settlements, POIs)
"""

import os
import re
from pathlib import Path

BASE_PATH = r"c:\Users\ronan\Dnd\website\D-and-D-Web-Page\Lore\DND"

# Build entity lookup: name -> relative path (from Lore/DND/)
ENTITIES = {}

def add_entity(name, path, alternates=None):
    """Add an entity and its alternate names to the lookup"""
    ENTITIES[name] = path
    if alternates:
        for alt in alternates:
            if alt not in ENTITIES:  # Don't overwrite more specific matches
                ENTITIES[alt] = path

def build_entity_list():
    """Scan filesystem and build entity lookup table"""
    
    # Characters
    char_path = os.path.join(BASE_PATH, "Character Lore", "Modern Characters")
    if os.path.exists(char_path):
        for f in os.listdir(char_path):
            if f.endswith(".md"):
                name = f[:-3]  # Remove .md
                rel_path = f"Character Lore/Modern Characters/{f}"
                add_entity(name, rel_path)
                
                # Add common short forms
                parts = name.split()
                if len(parts) >= 2:
                    # "Bridge-Warden Elara Thornguard" -> "Elara Thornguard", "Thornguard"
                    if parts[0] in ["Bridge-Warden", "Bridge-Commander", "Captain", "Commander", 
                                   "Elder", "Father", "Father-Commander", "Father-Provost",
                                   "Fleet-Captain", "Guildmaster", "Guildmistress", "Harbor-Warden",
                                   "Harbor-Elder", "Harbor-Master", "Harbormaster", "Headman",
                                   "Healer", "High", "Innkeeper", "Keeper", "King", "Knight-Commander",
                                   "Lady", "Lieutenant", "Lord", "Lord-Governor", "Lord-Marshal",
                                   "Lord-Mayor", "Lord-Regent", "Lord-Warden", "Magistra", "Magistrate",
                                   "Marshal", "Master", "Merchant", "Merchant-Prince", "Mother", "Old",
                                   "Portreeve", "Prince", "Queen", "Quartermaster-General", "Reeve",
                                   "Root-Mother", "Sergeant", "Shore-Warden", "Signal-Master", "Sir",
                                   "Sister", "Sword-Instructor", "Thane", "Trader", "Warden",
                                   "Warden-Captain", "Warden-Mayor", "Watch-Captain", "Watch-Keeper",
                                   "Widow", "Young", "Cleric", "Clerk", "Cadet", "Commandant", "Drill-Master"]:
                        # Add the name without title
                        short_name = " ".join(parts[1:])
                        if len(short_name) > 3:  # Avoid too-short matches
                            add_entity(short_name, rel_path)
                        # Add just surname if exists
                        if len(parts) >= 3:
                            surname = parts[-1]
                            if len(surname) > 4:  # Avoid short surnames
                                add_entity(surname, rel_path)
    
    # Villages
    village_path = os.path.join(BASE_PATH, "Kingdoms", "Braewood", "Village")
    if os.path.exists(village_path):
        for f in os.listdir(village_path):
            if f.endswith(".md"):
                name = f[:-3]
                rel_path = f"Kingdoms/Braewood/Village/{f}"
                add_entity(name, rel_path)
    
    # Towns
    town_path = os.path.join(BASE_PATH, "Kingdoms", "Braewood", "Town")
    if os.path.exists(town_path):
        for f in os.listdir(town_path):
            if f.endswith(".md"):
                name = f[:-3]
                rel_path = f"Kingdoms/Braewood/Town/{f}"
                add_entity(name, rel_path)
    
    # Medium Cities
    medium_path = os.path.join(BASE_PATH, "Kingdoms", "Braewood", "Medium City")
    if os.path.exists(medium_path):
        for f in os.listdir(medium_path):
            if f.endswith(".md"):
                name = f[:-3]
                rel_path = f"Kingdoms/Braewood/Medium City/{f}"
                add_entity(name, rel_path)
    
    # Large Cities
    large_path = os.path.join(BASE_PATH, "Kingdoms", "Braewood", "Large Cities")
    if os.path.exists(large_path):
        for f in os.listdir(large_path):
            if f.endswith(".md"):
                name = f[:-3]
                rel_path = f"Kingdoms/Braewood/Large Cities/{f}"
                add_entity(name, rel_path)
    
    # POIs
    poi_path = os.path.join(BASE_PATH, "Kingdoms", "Braewood", "POI")
    if os.path.exists(poi_path):
        for f in os.listdir(poi_path):
            if f.endswith(".md"):
                name = f[:-3]
                rel_path = f"Kingdoms/Braewood/POI/{f}"
                add_entity(name, rel_path)
                # Add alternates for Grand Span
                if name == "The Grand Span":
                    add_entity("Grand Span", rel_path)
                    add_entity("Tharnic Bridge", rel_path)
                    add_entity("Pontem inter Mundos", rel_path)
    
    # Kingdoms
    for kingdom in ["Braewood", "Islefield", "Kluimont", "Lavalto"]:
        kingdom_file = os.path.join(BASE_PATH, "Kingdoms", kingdom, f"{kingdom}.md")
        if os.path.exists(kingdom_file):
            add_entity(kingdom, f"Kingdoms/{kingdom}/{kingdom}.md")
    
    # Islefield cities
    rye_path = os.path.join(BASE_PATH, "Kingdoms", "Islefield", "Large Cities", "Rye.md")
    if os.path.exists(rye_path):
        add_entity("Rye", "Kingdoms/Islefield/Large Cities/Rye.md")

def url_encode_path(path):
    """URL encode spaces in path"""
    return path.replace(" ", "%20")

def get_relative_path(from_file, to_path):
    """Calculate relative path from one file to another"""
    from_dir = os.path.dirname(from_file)
    # Count how many levels up we need to go
    from_parts = from_dir.split(os.sep)
    
    # Find common prefix with BASE_PATH
    base_parts = BASE_PATH.split(os.sep)
    
    # Calculate relative path
    from_rel = os.path.relpath(from_dir, BASE_PATH)
    levels_up = len(from_rel.split(os.sep)) if from_rel != "." else 0
    
    prefix = "../" * levels_up
    return prefix + to_path

def is_already_linked(text, start, end):
    """Check if the text at position is already inside a markdown link"""
    # Look backwards for [ and check if we're inside a link
    before = text[:start]
    after = text[end:]
    
    # Check if we're inside [text](url) - between [ and ]
    last_open = before.rfind('[')
    last_close = before.rfind(']')
    if last_open > last_close:
        # We're after an open [ - check if there's a close before us
        return True
    
    # Check if we're inside the URL part (url)
    last_paren_open = before.rfind('(')
    last_paren_close = before.rfind(')')
    if last_paren_open > last_paren_close:
        # Check if this is a markdown link pattern
        if last_close > 0 and before[last_close:last_paren_open+1] == "](":
            return True
    
    return False

def is_in_header_or_formatting(text, start):
    """Check if position is in a header, table, or bold formatting"""
    # Find the start of the current line
    line_start = text.rfind('\n', 0, start) + 1
    line = text[line_start:start]
    
    # Skip if in header
    if line.lstrip().startswith('#'):
        return True
    
    # Skip if in table (starts with |)
    if '|' in line:
        return True
    
    # Skip if inside **bold** markers
    bold_before = line.count('**')
    if bold_before % 2 == 1:  # Odd number means we're inside bold
        return True
    
    return False

def process_file(filepath):
    """Process a single file and add cross-reference links"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    current_file_name = os.path.basename(filepath)[:-3]  # Remove .md
    
    # Sort entities by length (longest first) to match longer names before shorter
    sorted_entities = sorted(ENTITIES.items(), key=lambda x: len(x[0]), reverse=True)
    
    for name, rel_path in sorted_entities:
        # Skip self-references
        if name == current_file_name:
            continue
        
        # Skip very short names (too many false positives)
        if len(name) < 4:
            continue
        
        # Create pattern with word boundaries
        pattern = r'\b' + re.escape(name) + r'\b'
        
        # Find all matches
        matches = list(re.finditer(pattern, content, re.IGNORECASE))
        
        # Process matches in reverse order (so positions don't shift)
        for match in reversed(matches):
            start, end = match.start(), match.end()
            matched_text = match.group()
            
            # Skip if already linked
            if is_already_linked(content, start, end):
                continue
            
            # Skip if in header or formatting
            if is_in_header_or_formatting(content, start):
                continue
            
            # Calculate relative path
            relative_url = get_relative_path(filepath, rel_path)
            relative_url = url_encode_path(relative_url)
            
            # Create the link
            link = f"[{matched_text}]({relative_url})"
            
            # Replace in content
            content = content[:start] + link + content[end:]
    
    # Only write if changed
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    print("Building entity list...")
    build_entity_list()
    print(f"Found {len(ENTITIES)} entities to link")
    
    # Get all files to process
    files_to_process = []
    
    # Character files
    char_path = os.path.join(BASE_PATH, "Character Lore", "Modern Characters")
    if os.path.exists(char_path):
        for f in os.listdir(char_path):
            if f.endswith(".md"):
                files_to_process.append(os.path.join(char_path, f))
    
    # Settlement files
    for category in ["Village", "Town", "Medium City", "Large Cities"]:
        path = os.path.join(BASE_PATH, "Kingdoms", "Braewood", category)
        if os.path.exists(path):
            for f in os.listdir(path):
                if f.endswith(".md"):
                    files_to_process.append(os.path.join(path, f))
    
    # POI files
    poi_path = os.path.join(BASE_PATH, "Kingdoms", "Braewood", "POI")
    if os.path.exists(poi_path):
        for f in os.listdir(poi_path):
            if f.endswith(".md"):
                files_to_process.append(os.path.join(poi_path, f))
    
    print(f"Processing {len(files_to_process)} files...")
    
    modified_count = 0
    for i, filepath in enumerate(files_to_process):
        filename = os.path.basename(filepath)
        if process_file(filepath):
            print(f"[{i+1}/{len(files_to_process)}] Modified: {filename}")
            modified_count += 1
        else:
            print(f"[{i+1}/{len(files_to_process)}] No changes: {filename}")
    
    print(f"\nDone! Modified {modified_count} files.")

if __name__ == "__main__":
    main()
