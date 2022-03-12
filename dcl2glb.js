import parse from 'url-parse'
import axios from 'axios'
import { promises as fs } from 'fs';
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database 
const supabase = createClient('https://vdwvfnzzztqewzwusrie.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTU4MjY1MiwiZXhwIjoxOTU3MTU4NjUyfQ.YoS5G1P3Lg87zUQDQJuDOMkKDbuLi5XFYB8DLgpnrnw')

export async function parse_url(url){
  const parsed_url = parse(url).pathname
  const contract = parsed_url.split("/")[2]

  const item = parsed_url.split("/")[4]

  let content_url = 'https://peer.decentraland.org/lambdas/collections/wearables?wearableId=urn:decentraland:matic:collections-v2:' + contract

  if(item){
    content_url = content_url + ':' + item
  }

  const response = await axios.get(content_url);
  console.log(content_url)
  const content_data_url = response.data['wearables'][0]['data']['representations'][0]['contents'][0]['url']
    
  const content = await axios.get(content_data_url, {responseType: 'arraybuffer'})

  const buf = Buffer.from(content.data, "binary");

  const { data, error } = await supabase
  .storage
  .from('models')
  .upload(parsed_url + '.glb', buf, {
    cacheControl: '3600',
    upsert: true
  })

  var data_url = null

  if(error){
    console.log(data, error)
  }else{
    data_url = "https://vdwvfnzzztqewzwusrie.supabase.in/storage/v1/object/public/" + data['Key']
  }

  return data_url
}