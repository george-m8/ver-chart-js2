import argparse
import csv
import json

def parse_csv_to_json(input_file, output_file):
    """Read CSV from `input_file` and write JSON to `output_file`."""
    with open(input_file, "r", encoding="utf-8") as csv_f:
        reader = csv.DictReader(csv_f)
        rows = list(reader)
    with open(output_file, "w", encoding="utf-8") as json_f:
        json.dump(rows, json_f, indent=2)
    print(f"CSV successfully converted to JSON.\nInput: {input_file}\nOutput: {output_file}")

def main():
    parser = argparse.ArgumentParser(description="Convert CSV to JSON.")
    parser.add_argument("--input", "-i", required=True, help="Path to the input CSV file.")
    parser.add_argument("--output", "-o", required=True, help="Path for the output JSON file.")
    args = parser.parse_args()

    parse_csv_to_json(args.input, args.output)

if __name__ == "__main__":
    main()