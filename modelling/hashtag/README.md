---
license: mit
tags:
- kobart-hashtag
- generated_from_trainer
base_model: gogamza/kobart-base-v2
model-index:
- name: modelling
  results: []
---

<!-- This model card has been generated automatically according to the information the Trainer had access to. You
should probably proofread and complete it, then remove this comment. -->

# modelling

This model is a fine-tuned version of [gogamza/kobart-base-v2](https://huggingface.co/gogamza/kobart-base-v2) on an unknown dataset.
It achieves the following results on the evaluation set:
- Loss: 0.7086

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
| 0.2628        | 1.23  | 500  | 0.6570          |
| 0.1678        | 2.47  | 1000 | 0.7086          |
| 0.1958        | 3.7   | 1500 | 0.7066          |
| 0.1283        | 4.94  | 2000 | 0.7354          |
| 0.0883        | 6.17  | 2500 | 0.7892          |
| 0.066         | 7.41  | 3000 | 0.8266          |


### Framework versions

- Transformers 4.39.3
- Pytorch 2.1.0+cu121
- Datasets 2.18.0
- Tokenizers 0.15.0
