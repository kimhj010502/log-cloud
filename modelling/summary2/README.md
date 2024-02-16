---
license: mit
base_model: gogamza/kobart-summarization
tags:
- kobart-summarization-diary
- generated_from_trainer
model-index:
- name: summary2
  results: []
---

<!-- This model card has been generated automatically according to the information the Trainer had access to. You
should probably proofread and complete it, then remove this comment. -->

# summary2

This model is a fine-tuned version of [gogamza/kobart-summarization](https://huggingface.co/gogamza/kobart-summarization) on an unknown dataset.
It achieves the following results on the evaluation set:
- Loss: 0.3881

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
| 1.4832        | 1.48  | 500  | 0.3925          |
| 0.2494        | 2.96  | 1000 | 0.3881          |
| 0.124         | 4.44  | 1500 | 0.4443          |
| 0.0713        | 5.92  | 2000 | 0.4670          |
| 0.0376        | 7.4   | 2500 | 0.4967          |


### Framework versions

- Transformers 4.37.2
- Pytorch 2.1.2+cu118
- Datasets 2.16.1
- Tokenizers 0.15.0
