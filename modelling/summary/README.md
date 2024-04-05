---
license: mit
tags:
- kobart-summarization-diary
- generated_from_trainer
base_model: gogamza/kobart-summarization
model-index:
- name: summary2
  results: []
---

<!-- This model card has been generated automatically according to the information the Trainer had access to. You
should probably proofread and complete it, then remove this comment. -->

# summary2

This model is a fine-tuned version of [gogamza/kobart-summarization](https://huggingface.co/gogamza/kobart-summarization) on an unknown dataset.
It achieves the following results on the evaluation set:
- Loss: 0.3377

## Model description

More information needed

## Intended uses & limitations

More information needed

## Training and evaluation data

More information needed

## Training procedure

### Training hyperparameters

The following hyperparameters were used during training:
- learning_rate: 5.6e-05
- train_batch_size: 8
- eval_batch_size: 8
- seed: 42
- optimizer: Adam with betas=(0.9,0.999) and epsilon=1e-08
- lr_scheduler_type: linear
- lr_scheduler_warmup_steps: 300
- num_epochs: 50

### Training results

| Training Loss | Epoch | Step | Validation Loss |
|:-------------:|:-----:|:----:|:---------------:|
| 1.5089        | 1.23  | 500  | 0.3360          |
| 0.238         | 2.47  | 1000 | 0.3377          |
| 0.1456        | 3.7   | 1500 | 0.3513          |
| 0.0848        | 4.94  | 2000 | 0.3753          |
| 0.0482        | 6.17  | 2500 | 0.4024          |


### Framework versions

- Transformers 4.39.3
- Pytorch 2.1.0+cu121
- Datasets 2.18.0
- Tokenizers 0.15.0
