import folder_paths
import comfy.samplers

class AnyType(str):
    def __ne__(self, __value: object) -> bool:
        return False

anyType = AnyType("*")

class DERP_SLIDER:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "derpInt": ("INT", {"default": 20, "min": -4294967296, "max": 4294967296}),
                "derpFloat": ("FLOAT", {"default": 20, "min": -4294967296, "max": 4294967296}),
                "floatCheck": ("INT", {"default": 0, "min": 0, "max": 1}),
            },
        }

    RETURN_TYPES = (anyType,)
    RETURN_NAMES = ("X",)

    FUNCTION = "main"
    CATEGORY = "🔞 DerpNodes/Beta"

    def main(self, derpInt, derpFloat, floatCheck):
        if floatCheck > 0:
            out = derpFloat
        else:
            out = derpInt
        return (out,)

class derpSliderAlpha:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "derpInt": ("INT", {"default": 20, "min": -4294967296, "max": 4294967296}),
                "derpFloat": ("FLOAT", {"default": 20, "min": -4294967296, "max": 4294967296}),
                "floatCheck": ("INT", {"default": 0, "min": 0, "max": 1}),
            },
        }

    RETURN_TYPES = (anyType,)
    RETURN_NAMES = ("X",)

    FUNCTION = "main"
    CATEGORY = "🔞 DerpNodes/Alpha"

    def main(self, derpInt, derpFloat, floatCheck):
        if floatCheck > 0:
            out = derpFloat
        else:
            out = derpInt
        return (out,)

# from ReplentishNodes
class DerpLoadSamplerName:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "sampler_name": (comfy.samplers.KSampler.SAMPLERS, {"tooltip": "The name of the sampler."}),
            }
        }

    RETURN_TYPES = (anyType,)
    OUTPUT_TOOLTIPS = ("The sampler name.",)
    FUNCTION = "load_samplers_name"

    CATEGORY = "🔞 DerpNodes/Alpha"
    DESCRIPTION = "Select a sampler name and output as a string."

    def load_samplers_name(self, sampler_name):
        return (sampler_name, )

# Define MISC_CLASS_MAPPINGS to let ComfyUI know about the custom nodes
MISC_CLASS_MAPPINGS = {
    'DERP_SLIDER' : DERP_SLIDER,
    'derpSliderAlpha' : derpSliderAlpha,
    'DerpLoadSamplerName': DerpLoadSamplerName,
}
