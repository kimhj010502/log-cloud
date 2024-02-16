---
license: mit
tags:
- kobart-summarization-diary
- generated_from_trainer
base_model: gogamza/kobart-summarization
model-index:
- name: summary
  results: []
---

<!-- This model card has been generated automatically according to the information the Trainer had access to. You
should probably proofread and complete it, then remove this comment. -->

# summary

This model is a fine-tuned version of [gogamza/kobart-summarization](https://huggingface.co/gogamza/kobart-summarization) on an unknown dataset.
It achieves the following results on the evaluation set:
- Loss: 0.4011

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
| 1.4804        | 1.47  | 500  | 0.4035          |
| 0.2475        | 2.93  | 1000 | 0.4011          |
| 0.1249        | 4.4   | 1500 | 0.4591          |
| 0.072         | 5.87  | 2000 | 0.4671          |
| 0.039         | 7.33  | 2500 | 0.5022          |


### Framework versions

- Transformers 4.37.2
- Pytorch 2.1.2+cu118
- Datasets 2.16.1
- Tokenizers 0.15.0
