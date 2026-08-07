---
layout: ../../layouts/TutorialLayout.astro
title: Galaxy NGS Analysis Pipeline
description: A Gomez Lab tutorial for quality control, alignment, variant calling, annotation, visualization, and interpretation using Galaxy.
---


<!-- excerpt start -->

This guide provides a flexible workflow for analyzing next-generation sequencing (NGS) data using Galaxy. The tutorial walks you through each step of the process, from setting up your Galaxy environment to interpreting results, ensuring a comprehensive approach to variant analysis. A **[practice exercise](#practice-example)** is available to reinforce learning and provide hands-on experience for your project. 

<!-- excerpt end -->

---

## Practice Example

  - Download the sample dataset from Figshare: [Click to Download Dataset](https://doi.org/10.6084/m9.figshare.28620122)  
  - Access the example assessment form at: [Practice Exercise](https://docs.google.com/forms/d/e/1FAIpQLSf-G7urZTzoOc5KH99gQ2ixTK2eNJTTlkPi2B7C9lIlLIMwMw/viewform?usp=header)  
  - Follow the steps provided in this tutorial to analyze a sample dataset.  
  - Answer the questions based on your findings and submit your responses.

---

## Tutorial Sections

- [General Prerequisites](#general-prerequisites)
- [1. Set Up Your Galaxy Environment](#set-up-your-galaxy-environment)
- [2. Understand Your Sequencing Data](#understand-your-sequencing-data)
- [3. Align Reads to a Reference Genome](#align-reads-to-a-reference-genome)
- [4. Call Variants](#call-variants)
- [5. Annotate Variants](#annotate-variants)
- [6. Visualize Variants](#visualize-variants)
- [7. Analyze and Interpret Results](#analyze-and-interpret-results)

---

## General Prerequisites

- **Objective**: Analyze NGS data to identify and interpret variants for `[SPECIFIC_PURPOSE, e.g., clinical reporting, research discovery]`.
- **Input Data**:
  - Paired-end FASTQ files: `[SAMPLE_NAME]_R1.fq`, `[SAMPLE_NAME]_R2.fq`
  - BED file: `[TARGET_REGIONS].bed` (defines regions of interest)
- **Tools Needed**:
  - [Galaxy](https://usegalaxy.org/) (Register, no download needed)
  - [IGV](https://igv.org/) (Download required)
  - [wANNOVAR](http://wannovar.wglab.org/) (Use institutional email)
  - [VEP](http://grch37.ensembl.org/Homo_sapiens/Tools/VEP) (Web-based)
- **Hardware**: Computer with 100MB–1GB storage, large or dual-monitor setup recommended.

---

<style>
  .tutorial-box {
    border-radius: 12px;
    padding: 15px;
    margin: 15px 0;
    background: #f8f9fa;
    border: 1px solid #ccc;
  }
</style>

## Set Up Your Galaxy Environment

**Goal**: Establish a workspace for data analysis.

**Steps**:
1. Visit [https://usegalaxy.org/](https://usegalaxy.org/) and click “Login or Register” to create an account (use Firefox, Chrome, or Safari).
2. Upload or request your instructor/collaborator to share the dataset (e.g., `[SAMPLE_NAME]_R1.fq`, `[SAMPLE_NAME]_R2.fq`, `[TARGET_REGIONS].bed`) within Galaxy.
3. Access shared data:
   - “History” panel (right) > “Histories Shared with Me”
   - Select shared history > “View” > “Import History” > “Start Using This History”

**Customization**: Replace `[SAMPLE_NAME]` (e.g., `TumorSample1`) and `[TARGET_REGIONS]` (e.g., `CancerPanel.bed`).

[Back to Tutorial Sections](#tutorial-sections)

---

## Understand Your Sequencing Data

**Goal**: Assess the quality and structure of raw sequencing data.

**Steps**:
1. **View FASTQ Data**:
   - In “History,” click the “eye” icon next to `[SAMPLE_NAME]_R1.fq`.
   - Examine FASTQ format:
   - - Record run number (e.g., 585).
- Interpret quality scores using [ASCII Phred table](http://drive5.com/usearch/manual/quality_score.html) (e.g., “5” = 1% error, “B” = 0.05% error).
2. **Run Quality Control**:
- Tools > “FASTQ Quality Control” > “FastQC Read Quality Reports”
- Input: `[SAMPLE_NAME]_R1.fq` > “Run Tool.” Repeat for `[SAMPLE_NAME]_R2.fq`.
- View “webpage” output and record:
- Total sequences
- Sequences flagged as poor quality
- Sequence length
- %GC content
- Assess quality metrics for concerns (e.g., low base quality).

**Customization**: Adjust quality thresholds based on project needs.

[Back to Tutorial Sections](#tutorial-sections)

---

## Align Reads to a Reference Genome

**Goal**: Map sequencing reads to a reference genome.

**Steps**:
1. **Align with BWA-MEM**:
- Tools > “Mapping” > “Map with BWA-MEM” (Version 0.7.17.1 or latest)
- Settings:
- Reference genome: `[REFERENCE_GENOME]` (e.g., `Human hg19`)
- Paired-end: Yes
- FASTQ files: `[SAMPLE_NAME]_R1.fq`, `[SAMPLE_NAME]_R2.fq`
- Run Tool (5–15 min). Output: `[SAMPLE_NAME].bam`
- Note size difference (e.g., 600MB vs. 1GB FASTQ due to compression).
2. **Sort the BAM File**:
- Tools > “Genomics ToolKits” > “Picard” > “SortSam” (Version 2.18.2.1)
- Input: `[SAMPLE_NAME].bam`
- Sort order: “Coordinate”
- Validation stringency: “Lenient”
- Run Tool
3. **Mark Duplicates**:
- Tools > “Picard” > “MarkDuplicates” (Version 2.18.2.1)
- Input: Sorted `[SAMPLE_NAME].bam`
- Run Tool. Outputs: Marked BAM, metrics file
- View metrics (e.g., % PCR duplicates).
4. **Remove Duplicates**:
- Tools > “SAM/BAM” > “RmDup” (Version 2.0.1)
- Input: Original `[SAMPLE_NAME].bam`
- Paired-end: Yes
- Run Tool. Compare sizes (e.g., % reduction vs. % duplicates).

**Alternative Approach: Running Without Removing Duplicates**

While removing duplicates is a common practice to reduce PCR artifacts, in some cases, it might be beneficial to retain duplicates:
- **Low Input DNA**: If the sample has a low DNA input, duplicate removal may significantly reduce coverage, potentially affecting variant detection.
- **Unique Molecular Identifiers (UMIs)**: If UMIs were used, duplicates can be tracked and distinguished, making removal unnecessary.
- **Somatic Variant Calling**: Retaining duplicates may help in detecting low-frequency somatic mutations in cancer studies.
- **Amplicon-Based Sequencing**: In targeted sequencing approaches (e.g., for viral or bacterial genomes), duplicates may represent true coverage rather than PCR artifacts.

To run the pipeline without removing duplicates, simply skip the "Remove Duplicates" step and proceed with variant calling as usual.
  
[Back to Tutorial Sections](#tutorial-sections)

---

## Call Variants

**Goal**: Identify genetic variants from aligned reads.

**Steps**:
1. **VarScan Workflow**:
- Tools > “SAM/BAM” > “Samtools mpileup” (Version 2.1.4)
- Input: Duplicate-removed `[SAMPLE_NAME].bam`
- Reference: `[REFERENCE_GENOME]`
- Run Tool → Output: Pileup file
- Tools > “Variant Calling” > “VarScan” (Version 2.4.2)
- Input: Pileup file
- Settings:
- Min read depth: 20
- Min supporting reads: 4
- Min base quality: 20
- Min variant frequency: 0.03
- Ignore >90% strand bias: Yes
- Run Tool → Output: `[SAMPLE_NAME]_VarScan.vcf`
2. **FreeBayes Workflow**:
- Tools > “Variant Calling” > “FreeBayes” (Version 1.1.0.46-0)
- Input: Duplicate-removed `[SAMPLE_NAME].bam`
- Reference: `[REFERENCE_GENOME]`
- Parameters: Simple diploid calling, Min coverage: 10
- Run Tool → Output: `[SAMPLE_NAME]_FreeBayes.vcf`
3. **Limit to Target Regions**:
- Tools > “VCF/BCF” > “VCF-BEDintersect” (Version 1.0.0)
- Inputs: Each VCF + `[TARGET_REGIONS].bed`
- Run Tool (twice). Outputs: Filtered VCFs
4. **Compare Variant Callers**:
- Click VCF files in History to view line counts.
- Record pre/post-BED intersect counts (e.g., VarScan: 9,535 → 48).

**Customization**: Add tools (e.g., GATK) or adjust thresholds.

[Back to Tutorial Sections](#tutorial-sections)

---

## Annotate Variants

**Goal**: Add functional and clinical context to variants.

**Steps**:
1. **wANNOVAR Annotation**:
- Download filtered VCFs (e.g., `[SAMPLE_NAME]_VarScan.bed.vcf`) via “disk” icon.
- Visit [http://wannovar.wglab.org/](http://wannovar.wglab.org/), upload VCF (max 2 runs, use `[YOUR_EMAIL]`).
- Download “genome” CSV.
- In Excel:
- Sort by `gnomad211_exome_AF`
- Filter `ExonicFunc.refGeneWithVer` (exclude “Synonymous SNV”)
- Filter `Func.refGeneWithVer` (exclude “intron”, “UTR3”)
2. **VEP Annotation**:
- Visit [http://grch37.ensembl.org/Homo_sapiens/Tools/VEP](http://grch37.ensembl.org/Homo_sapiens/Tools/VEP)
- Input: Paste variant (e.g., `chr7 55221822 55221822 C T`) or upload VCF
- Run and review annotations.
3. **Compare Results**:
- Identify shared and unique variants (e.g., TP53 hits).

**Customization**: Use SnpEff or filter by ClinVar.

[Back to Tutorial Sections](#tutorial-sections)

---

## Visualize Variants

**Goal**: Inspect alignments and variants visually.

**Steps**:
1. **Slice BAM File**:
- Tools > “SAM/BAM” > “Slice BAM by genomic regions”
- Input: Original `[SAMPLE_NAME].bam` + `[TARGET_REGIONS].bed`
- Run Tool → Download `.bam` and `.bai`
2. **View in IGV**:
- Install [IGV](https://igv.org/), load `[REFERENCE_GENOME]` (e.g., `hg19`)
- Load `.bam` and `.bai` (same name/folder)
- Zoom to variant (e.g., `7:140434574`)
- Sort reads by base (right-click > “Group by base”)
- Check for artifacts (e.g., strand bias).

[Back to Tutorial Sections](#tutorial-sections)

---

## Analyze and Interpret Results

**Goal**: Generate insights for `[SPECIFIC_PURPOSE]`.

**Steps**:
1. Apply pipeline to your dataset (e.g., `[YOUR_SAMPLE]_R1.fq`).
2. Identify key variants (e.g., somatic, actionable).
3. Compare with external data (e.g., COSMIC, clinical reports).
4. Document in a report/presentation.

**Customization**: Focus on your goal (e.g., cancer, rare disease).

[Back to Tutorial Sections](#tutorial-sections)

---

For further assistance, adapt this pipeline and contact [Felicia Gomez](https://oncology.wustl.edu/people/felicia-i-gomez-phd/)!
