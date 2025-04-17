import sys

#!/usr/bin/env python3

"""
sdp_to_xyz.py

A script to process SDP data and convert it to XYZ format.
"""


def main():
    """Main function to handle the conversion."""
    input_file = sys.argv[1]  # Input file path
    output_file = sys.argv[2]  # Output file path
    
    firstLine = True

    with open(input_file, 'r') as sdp_file, open(output_file, 'w') as xyz_file:
            for line in sdp_file:
                if firstLine:
                    # Skip the first line (header)
                    firstLine = False
                    continue
                
                foo = line.strip().split(',')  # Split the line by commas
                
                # Write the processed data to the output file
                xyz_file.write(f"{foo[3]} {foo[4]} {foo[5]}\n")  # Add a newline after each line


if __name__ == "__main__":
    main()