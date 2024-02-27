using Microsoft.AspNetCore.Mvc;
using WebAppplicationNER.DataHelper;
using WebAppplicationNER.resoponse;
using static System.Net.Mime.MediaTypeNames;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace WebAppplicationNER.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NerFoodAndNumberController : ControllerBase
    {
        public List<string> foods = new List<string>();
        public int maxfoodlen = 0;
        private List<string> GetFoods(string s)
        {
            List<string> result = new List<string>();
            var spilitedtext = s.Split(' ').Where(aa => aa != "").ToArray();
            for (int i = 0; i < spilitedtext.Length; i++)
            {
                string first = spilitedtext[i];
                string temp = "";
                if (foods.Contains(first))
                {
                    temp = first;
                }
                int counter = 0;
                for (int j = i + 1; j < spilitedtext.Length && counter < maxfoodlen; j++)
                {
                    first = first + " " + spilitedtext[j];


                    if (foods.Contains(first))
                    {
                        temp = first;
                        i = j;
                    }

                    counter++;
                }

                if (temp != "")
                {
                    result.Add(temp);
                }
            }
            return result;
        }
        private List<Numbersjs> GetNumbers(string s)
        {
            List<Numbersjs> result = new List<Numbersjs>();
            var spilitedtext = s.Split(' ').Where(aa => aa != "").ToArray();

            for (int i = 0; i < spilitedtext.Length; i++)
            {
                string first = spilitedtext[i];
                string temp = "";

                if (numbersjs.Select(aa => aa.persiantext).Contains(first))
                {
                    temp = first;
                }
                int counter = 0;
                for (int j = i + 1; j < spilitedtext.Length && counter < 3; j++)
                {
                    first = first + " " + spilitedtext[j];


                    if (numbersjs.Select(aa => aa.persiantext).Contains(first))
                    {
                        temp = first;
                        first = temp;
                        i = j;
                    }

                    counter++;
                }

                if (temp != "" )
                {
                    var number = numbersjs.Where(aa => aa.persiantext == temp).First();
                    result.Add(number);
                }
            }
            return result;
        }
        private List<Numbersjs> numbersjs { get; set; }
        public NerFoodAndNumberController()
        {
            string basepath = "C:\\Users\\EMERTAT\\Downloads\\WebAppplicationNER\\WebAppplicationNER\\data\\";
            string pathfood = basepath + "foodname.json";
            string pathnumber = basepath+ "number.json";
            var datamanagment = new DataManagment(pathfood, pathnumber);
            foods = datamanagment.foods.Select(aa => aa.name).ToList();
            numbersjs = datamanagment.numbers.ToList();
            maxfoodlen = foods.Max(aa => aa.Split(' ').Length);
        }
        //[HttpGet(Name = "GetFood")]
        //public IActionResult GetFood(string s)
        //{
        //    var result = GetFoods(s);
        //    var response=result.Select(aa=>new Food() { name=aa}).ToArray();
        //    return Ok(response);
        //}
        //[HttpGet(Name = "GetNumber")]
        //public IActionResult GetNumber(string s)
        //{
        //    var result = GetNumbers(s);
        //    return Ok(result);
        //}
        [HttpGet(Name = "GetNumberAndFood")]
        public IActionResult GetNumberAndFood(string s)
        {
            var spilitedText = s.Split(' ');
            
            var numbers=GetNumbers(s);
            var foods = GetFoods(s);
            List<Response> responses = new List<Response>();
            foreach(var food in foods)
            {
                int indexfood = s.IndexOf(food);
                int maxindexnum = 0;
                Numbersjs numberjs = new Numbersjs() { number=1,persiantext="یک"};
                foreach(var number in numbers)
                {
                    int indextemp = s.IndexOf(number.persiantext);
                    if (indextemp > indexfood)
                    {
                        continue;
                    }else if(indextemp > maxindexnum)
                    {
                        numberjs=number;
                        maxindexnum = indextemp;
                    }
                }
                responses.Add(new resoponse.Response() {number=numberjs,food=new Food() {name= food } });
            }
          
            return Ok(responses);
        }



    }
}
