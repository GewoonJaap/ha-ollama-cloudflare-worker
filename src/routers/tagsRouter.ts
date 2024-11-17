import { Hono } from 'hono';

const tagsRouter = new Hono();

tagsRouter.get('', (c) => {
  return c.json({
    "model": [
      {
        "name": "codellama:13b",
        "modified_at": "2023-11-04T14:56:49.277302595-07:00",
        "size": 7365960935,
        "digest": "9f438cb9cd581fc025612d27f7c1a6669ff83a8bb0ed86c94fcf4c5440555697",
        "details": {
          "format": "gguf",
          "family": "llama",
          "families": null,
          "parameter_size": "13B",
          "quantization_level": "Q4_0"
        }
      },
      {
        "name": "llama3:latest",
        "modified_at": "2023-12-07T09:32:18.757212583-08:00",
        "size": 3825819519,
        "digest": "fe938a131f40e6f6d40083c9f0f430a515233eb2edaa6d72eb85c50d64f2300e",
        "details": {
          "format": "gguf",
          "family": "llama",
          "families": null,
          "parameter_size": "7B",
          "quantization_level": "Q4_0"
        }
      }
    ]
  });
});

export default tagsRouter;